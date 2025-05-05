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
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "@/redux/user/actions";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";

const validationSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string(),
});

const AuthForm = () => {
  const dispatch = useDispatch<AppDispatch>();
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

  const onSubmit = (values: z.infer<typeof validationSchema>) => {
    const { email, password, name } = values;
    if (isLogin) {
      dispatch(loginUser({ email, password }));
      navigate("/dashboard");
    } else {
      dispatch(registerUser({ name: name ? name : "", email, password }));
      toast.success("Registered successfuly!");
      navigate("/not-verified");
    }
  };

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
    </>
  );
};

export default AuthForm;
