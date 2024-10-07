import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { _storeToken } from "./async-storage";
// import { COGNITO_POOL_ID, APP_CLIENT_ID } from "@env";

const COGNITO_POOL_ID = "ap-south-1_W2GXHRjrE";
const APP_CLIENT_ID = "24klk1167k95cb4t82af2ju48j";

const poolData = {
  UserPoolId: COGNITO_POOL_ID,
  ClientId: APP_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);
interface ResponseError {
  phone?: string;
  password?: string;
  username?: string;
  unknown?: string;
  accessToken: null;
}

interface ResponseSuccess {
  message: string;
  username?: string;
  phone?: string;
  accessToken?: string;
  statusCode?: number;
}

const useSignup = (
  username: string,
  password: string,
  phone: string
): Promise<ResponseError | ResponseSuccess> => {
  return new Promise<ResponseError | ResponseSuccess>((resolve, reject) => {
    userPool.signUp(
      username,
      password,
      [
        new CognitoUserAttribute({
          Name: "gender",
          Value: "N/A",
        }),
        new CognitoUserAttribute({
          Name: "phone_number",
          Value: phone,
        }),
        new CognitoUserAttribute({
          Name: "name",
          Value: username,
        }),
      ],
      [],
      (err, result) => {
        if (err) {
          // Handle error
          const errorMap: Record<string, Partial<ResponseError>> = {
            InvalidParameterException: { phone: err.message },
            InvalidPasswordException: {
              password: "Password should contain at least 6 characters",
            },
            UsernameExistsException: { username: err.message },
          };

          // If error name matches any in the map, reject with mapped message, otherwise return unknown error
          reject(errorMap[err.name] || { unknown: err.message });
        } else {
          // Handle success
          const cognitoUser = result?.user;
          const successResponse = {
            message: "User signed up successfully",
            user: cognitoUser?.getUsername(),
          };
          resolve(successResponse);
        }
      }
    );
  });
};

const useSignin = (
  username: string,
  password: string
): Promise<ResponseError | ResponseSuccess> => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // Handle successful login
        const accessToken = result.getIdToken().getJwtToken();

        // Fetch user attributes to get the phone number
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            console.error("Error fetching user attributes:", err);
            reject({ unknown: "Failed to retrieve user information." });
            return;
          }

          // Extract the phone number from user attributes
          let phone = "";
          attributes?.forEach((attribute) => {
            if (attribute.getName() === "phone_number") {
              phone = attribute.getValue();
            }
          });

          const successResponse: ResponseSuccess = {
            statusCode: 200,
            message: "User logged in successfully",
            username: cognitoUser.getUsername(),
            phone,
            accessToken,
          };

          resolve(successResponse);
        });
      },

      onFailure: (err) => {
        // Map error messages to more meaningful ones
        const errorMap: Record<string, Partial<ResponseError>> = {
          NotAuthorizedException: {
            username: "Incorrect username or password.",
          },
          UserNotFoundException: { password: "Username does not exist." },
          // Add more error mappings as necessary
        };

        // If error name matches any in the map, reject with mapped message, otherwise return unknown error
        reject({ unknown: errorMap[err.name]?.unknown || err.message });
      },
    });
  });
};

const useSignout = (): Promise<boolean | Error> => {
  return new Promise((resolve, reject) => {
    userPool.storage.sync((err) => {
      if (err) {
        console.error("Error syncing storage:", err);
        reject(err);
        return;
      }

      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut(() => {
          resolve(true);
        });
      } else {
        reject(new Error("No current user to sign out"));
      }
    });
  });
};

const fetchUser = (): Promise<
  | {
      username: string | null;
      phone: string | null;
      accessToken: string | null;
    }
  | Error
> => {
  return new Promise((resolve, reject) => {
    userPool.storage.sync((err, result) => {
      if (err) {
        console.error("Error syncing storage:", err);
        reject(err);
        return;
      }

      if (result === "SUCCESS") {
        const cognitoUser = userPool.getCurrentUser();
        if (!cognitoUser) {
          reject(new Error("No current user found"));
          return;
        }

        cognitoUser.getSession(
          (err: Error, session: CognitoUserSession | null) => {
            if (err) {
              console.error("Error getting session:", err);
              reject(err);
              return;
            }

            if (session && session.isValid()) {
              const accessToken = session.getIdToken().getJwtToken();

              cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                  console.error("Error fetching user attributes:", err);
                  reject(err);
                  return;
                }

                // Extract relevant attributes (phone number and username)
                let phone = null;
                let username = cognitoUser.getUsername(); // Username is directly accessible

                attributes?.forEach((attribute) => {
                  if (attribute.getName() === "phone_number") {
                    phone = attribute.getValue();
                  }
                });

                resolve({
                  username,
                  phone,
                  accessToken,
                });
              });
            } else {
              reject(new Error("Session is not valid"));
            }
          }
        );
      } else {
        reject(new Error("Storage sync failed"));
      }
    });
  });
};

export {
  useSignup,
  useSignin,
  useSignout,
  fetchUser,
  ResponseError,
  ResponseSuccess,
};
