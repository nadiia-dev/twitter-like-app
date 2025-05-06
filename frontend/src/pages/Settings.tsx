import ReAuthModal from "@/components/ReAuthModal";
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
import { handleFileChange } from "@/lib/handleFileChange";
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
  const [pendingAction, setPendingAction] = useState<() => Promise<void>>(
    () => async () => {}
  );
  const defaultValues = {
    name: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "https://placehold.co/400x400",
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
        toast.error(e.message);
      }
    }
  };

  const onDeleteClick = () => {
    setPendingAction(() => handleDeleteProfile);
    setIsDialogOpen(true);
  };

  const handleUpdateProfile = async (userData: { [k: string]: string }) => {
    try {
      if (user) {
        await updateUserProfile(user?.uid, userData);
        toast.success("Profile updated successfully");
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    const userData = Object.fromEntries(
      Object.entries({
        name: values?.name ?? "",
        email: values?.email ?? "",
        newPassword: values?.newPassword ?? "",
        photoURL: values?.photoURL ?? "",
      }).filter(([_, value]) => value !== undefined && value !== "")
    );

    if (values?.newPassword !== "") {
      setPendingAction(() => () => handleUpdateProfile(userData));
      setIsDialogOpen(true);
    } else {
      handleUpdateProfile(userData);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const newUrl = await handleFileChange({
        file,
        folder: "userPhotos",
      });

      form.setValue("photoURL", newUrl);
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
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
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar block */}
                  <div className="flex flex-col gap-4 md:w-1/3">
                    <Label htmlFor="picture" className="text-sm leading-none">
                      Avatar
                    </Label>
                    <Avatar className="h-30 w-30 rounded-lg overflow-hidden">
                      {form.watch("photoURL") && (
                        <AvatarImage
                          src={form.watch("photoURL")}
                          alt={user?.displayName || "user avatar"}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Avatar>
                    <div>
                      <Input id="picture" type="file" onChange={handleChange} />
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
                        <h2 className="font-bold text-sm">Change Password</h2>
                        <p className="text-xs">
                          You can update your password here. You`ll be asked to
                          confirm your identity before saving changes.
                        </p>
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
                    onClick={onDeleteClick}
                  >
                    Delete profile
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <ReAuthModal
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onSuccess={pendingAction}
        />
      </div>
    </RootLayout>
  );
};

export default SettingsPage;
