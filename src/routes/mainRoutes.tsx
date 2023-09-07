import { ForgotPasswordPage } from "src/pages/ForgotPasswordPage";
import { LoginPage } from "src/pages/LoginPage";
import { RegisterPage } from "src/pages/RegisterPage";
import { ResetPasswordPage } from "src/pages/ResetPasswordPage";

export const MainRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/resetpassword",
    element: <ResetPasswordPage />,
  },
];
