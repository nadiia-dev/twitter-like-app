import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import GoogleAuthButton from "./GoogleAuthButton";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/;

const validationSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .regex(
      passwordRegex,
      "Password must contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)"
    ),
});

const AuthForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { register, login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isLogin = pathname === "/login" ? true : false;
  const defaultValues = isLogin
    ? {
        email: "",
        password: "",
      }
    : {
        name: "",
        email: "",
        password: "",
      };

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    const { email, password, name } = values;
    if (isLogin) {
      await login({ email, password });
      navigate("/feed");
    } else {
      try {
        const res = await register({ name: name ? name : "", email, password });
        if (res) {
          toast.success("Registered successfully!");
          navigate("/not-verified");
        }
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message);
        }
      }
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {isLogin ? "Login to " : "Register"} your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="john" type="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@mail.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    {isLogin && (
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Forgot password?
                      </Button>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-between">
          <small>
            {isLogin ? "Don`t have an account?" : "Already have an account?"}
          </small>
          <Button asChild variant="outline" size="sm">
            <Link to={`/${isLogin ? "register" : "login"}`}>
              {isLogin ? "Register" : "Login"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <div>or</div>
      <GoogleAuthButton />
      {isLogin && (
        <ForgotPasswordModal
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
    </>
  );
};

export default AuthForm;
