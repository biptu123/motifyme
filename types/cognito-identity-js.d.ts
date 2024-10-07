import "amazon-cognito-identity-js";

declare module "amazon-cognito-identity-js" {
  interface CognitoUserPool {
    storage: {
      sync: (callback: (err: Error | null, result: string) => void) => void;
    };
  }
}
