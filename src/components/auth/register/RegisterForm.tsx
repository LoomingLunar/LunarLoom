"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import * as z from "zod";
import AuthSubmitButton from "../AuthSubmitButton";
import collection from "@/configurations/collection";
import { Axios } from "@/providers/Axios";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Your name should have  3 characters",
  }),
  username: z.string().min(3, {
    message: "Username should have  3 characters",
  }),
  email: z.string().min(5, {
    message: "Enter a valid Email",
  }),
  password: z.string().min(6, {
    message: "Password should have 6 characters",
  }),
});

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(registerData: z.infer<typeof formSchema>) {
    console.log(registerData);
    try {
        Axios.post("/auth/register", registerData)
        .then(({ data }: AxiosResponse) => {
          if (!data?.success) return toast.error(data?.message);
          toast.success(data?.message);
          router.push("/verify-email");
        });
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      form.reset();
    }
  }
  return (
    <div className="flex flex-col w-full space-y-2.5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormMessage className="text-start" />
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    {...field}
                    className="w-full rounded-sm py-6 bg-zinc-200/40 border-[.5px]
                    focus-visible:ring-0 peer border-black/50"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormMessage className="text-start" />
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Username"
                    {...field}
                    className="w-full rounded-sm py-6 bg-zinc-200/40 border-[.5px]
                    focus-visible:ring-0 peer border-black/50"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormMessage className="text-start" />
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...field}
                    className="w-full focus-visible:ring-0 peer rounded-sm py-6 bg-zinc-200/40
                     border-[.5px] border-black/50"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormMessage className="text-start" />
                <FormControl>
                  <div className="flex w-full rounded-sm bg-zinc-200/40 border-[.5px] border-black/50">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="py-6 focus-visible:ring-0 peer border-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="mr-4"
                    >
                      {showPassword ? (
                        <IoEyeOffOutline size="24px" />
                      ) : (
                        <IoEyeOutline size="24px" />
                      )}
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <AuthSubmitButton>Sign Up</AuthSubmitButton>
        </form>
      </Form>
      <span className="flex space-x-1 text-center items-center justify-center text-sm">
        <p>Already have an account?</p>
        <Link href="/login">
          <p className="text-[#00A3FF]">Login</p>
        </Link>
      </span>
    </div>
  );
}
