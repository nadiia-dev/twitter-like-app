import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import RootLayout from "@/components/RootLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const validationSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email(),
    photoURL: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasOld = !!data.oldPassword;
    const hasNew = !!data.newPassword;
    const hasConfirm = !!data.confirmPassword;

    if (hasOld) {
      if (!hasNew) {
        ctx.addIssue({
          path: ["newPassword"],
          code: "custom",
          message: "New password is required if old password is provided",
        });
      }
      if (!hasConfirm) {
        ctx.addIssue({
          path: ["confirmPassword"],
          code: "custom",
          message: "Please confirm the new password",
        });
      }
      if (
        data.newPassword &&
        data.confirmPassword &&
        data.newPassword !== data.confirmPassword
      ) {
        ctx.addIssue({
          path: ["confirmPassword"],
          code: "custom",
          message: "Passwords do not match",
        });
      }
    }
  });

const SettingsPage = () => {
  const { user, updateUserProfile, deleteProfile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const defaultValues = {
    name: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile();
      setIsDialogOpen(false);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    const userData = {
      name: values?.name ?? "",
      email: values?.email ?? "",
      newPassword: values?.newPassword ?? "",
      photoURL: values?.photoURL ?? "",
    };

    try {
      if (user) {
        await updateUserProfile(user?.uid, userData);
        toast.success("Profile updated successfully");
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  };

  return (
    <RootLayout>
      <div className="p-4">
        <header className="flex gap-4 items-center mb-4">
          <Settings size={30} />
          <h1 className="font-bold text-3xl font-orbitron">Profile Settings</h1>
        </header>
        <Card className="w-full">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar block */}
                  <div className="flex flex-col gap-4 md:w-1/3">
                    <Avatar className="h-20 w-20 rounded-lg overflow-hidden">
                      <AvatarImage
                        src={user?.photoURL || "https://placehold.co/400x400"}
                        alt="user avatar"
                      />
                    </Avatar>
                    <div>
                      <Label htmlFor="picture" className="mb-2">
                        Avatar
                      </Label>
                      <Input id="picture" type="file" name="photoURL" />
                    </div>
                  </div>

                  {/* Form inputs */}
                  <div className="flex flex-col gap-4 md:flex-1">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input disabled {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {user?.providerData[0].providerId !== "google.com" && (
                      <>
                        <FormField
                          control={form.control}
                          name="oldPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Old Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button type="submit">Save profile</Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Delete profile
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <DeleteConfirmModal
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleSubmitAction={handleDeleteProfile}
        />
      </div>
    </RootLayout>
  );
};

export default SettingsPage;
