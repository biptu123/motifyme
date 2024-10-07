import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/slices/userSlice"; // Adjust the import path as necessary
import { fetchUser } from "@/lib/cognito"; // Adjust the import path as necessary

const useFetchUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchUser();

        if (result instanceof Error) {
          throw new Error(result.message); // Handle error from fetchUser
        }

        const { username, phone, accessToken } = result;

        if (username && accessToken) {
          // Dispatch the action to set the user in the Redux store
          dispatch(setUser({ username, phone, accessToken }));
        } else {
          // If no valid user data, clear user in the Redux store
          dispatch(clearUser());
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        dispatch(clearUser()); // Clear user if fetching fails
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  return { loading, error };
};

export default useFetchUser;