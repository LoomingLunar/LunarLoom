"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,  
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import AuthSubmitButton from "../AuthSubmitButton";
import { jwtDecode } from "jwt-decode";
import collection from "@/configurations/collection";
import { Axios } from "@/providers/Axios";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Enter Valid OTP",
  }),
});

export default function VerifyEmailForm() {
  const router = useRouter();
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setUsername = useUserStore((state) => state.setUsername);
  const setUserId = useUserStore((state) => state.setUsername);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
        Axios.post("/auth/verify-email", values)
        .then(({ data }: AxiosResponse) => {
          console.log(data);

          if (!data?.success)
            return toast.error(data?.message || "Something went wrong!");
          setAccessToken(data?.accessToken);
          setAccessToken(data?.accessToken);
          let username: string = ''
          let userId: string = ''
          username = jwtDecode<{ username: string }>(data?.accessToken)?.username;
          userId = jwtDecode<{ userId: string }>(data?.accessToken)?.userId;
          setUsername(username)
          setUserId(userId)
          toast.success("Logged in successfully!");
          router.push("/chat");
        });
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "Something went wrong");
    }
  }
  return (
    <div className="flex flex-col w-full space-y-2.5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center">
                <FormMessage className="text-center" />
                <FormControl>
                  <div className="w-full border-b-2 border-[#483375] ">
                    <Input
                      type="text"
                      placeholder=""
                      {...field}
                      className=" border-dotted font-extrabold text-2xl text-center focus-visible:ring-0 peer border-0 fon"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <AuthSubmitButton>SUBMIT</AuthSubmitButton>
        </form>
      </Form>
    </div>
  );
}
