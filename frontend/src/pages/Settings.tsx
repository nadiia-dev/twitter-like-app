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
import { z } from "zod";

const validationSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string(),
  photoUrl: z.string().optional(),
});

const SettingsPage = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      password: "",
      photoUrl: user?.photoURL || "",
    },
  });

  const onSubmit = async () => {};

  return (
    <RootLayout>
      <div className="p-4">
        <header className="flex gap-4 items-center mb-4">
          <Settings size={30} />
          <h1 className="font-bold text-3xl font-orbitron">Profile Settings</h1>
        </header>
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-row gap-4">
                  <div className="flex-1 grid w-full max-w-sm items-center gap-1.5">
                    <Avatar className="h-48 w-48 rounded-lg overflow-hidden mb-4">
                      <AvatarImage
                        src={
                          user?.photoURL
                            ? user?.photoURL
                            : "https://placehold.co/400x400"
                        }
                        alt="user avatar"
                      />
                    </Avatar>

                    <Label htmlFor="picture">Avatar</Label>
                    <Input id="picture" type="file" />
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
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
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input disabled type="email" {...field} />
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
                          <FormLabel>New Password</FormLabel>
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
                  </div>
                </div>
                <div className="flex gap-4 f-wull items-center justify-center">
                  <Button type="submit">Save profile</Button>
                  <Button
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-red-500 hover:bg-red-700"
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
        />
      </div>
    </RootLayout>
  );
};

export default SettingsPage;
