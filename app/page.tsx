"use client";

import { toast } from "sonner";
import { useState } from "react";
import CTA from "@/components/cta";
import Form from "@/components/form";
import Logos from "@/components/logos";
import Particles from "@/components/ui/particles";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!name || !email) {
      toast.error("Please fill in all fields 😠");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address 😠");
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const mailResponse = await fetch("/api/mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstname: name, email }),
        });

        if (!mailResponse.ok) {
          throw new Error(mailResponse.status === 429 ? "rate_limited" : "email_failed");
        }

        const waitlistResponse = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });

        const waitlistData = await waitlistResponse.json();

        if (!waitlistResponse.ok) {
          if (waitlistResponse.status === 409) {
            throw new Error("already_registered");
          }
          throw new Error(
            waitlistResponse.status === 429 ? "rate_limited" : waitlistData.error || "save_failed"
          );
        }

        resolve({ name });
      } catch (error) {
        console.error("Submission error:", error);
        reject(error instanceof Error ? error.message : "unknown_error");
      }
    });

    toast.promise(promise, {
      loading: "Getting you on the waitlist... 🚀",
      success: () => {
        setName("");
        setEmail("");
        return "Thank you for joining the waitlist 🎉";
      },
      error: (error) => {
        switch (error) {
          case "rate_limited":
            return "You're doing that too much. Please try again later 😅";
          case "email_failed":
            return "Failed to send email. Please try again 😢";
          case "already_registered":
            return "This email is already registered 😅";
          case "save_failed":
            return "Failed to save your details. Please try again 😢";
          default:
            return "An unexpected error occurred. Please try again 😢";
        }
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-12 md:pt-24">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <CTA />
        <Form
          name={name}
          email={email}
          handleNameChange={handleNameChange}
          handleEmailChange={handleEmailChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </section>
      <Footer />
      <Particles
        quantityDesktop={350}
        quantityMobile={100}
        ease={80}
        color={"#F7FF9B"}
        refresh
      />
    </main>
  );
}