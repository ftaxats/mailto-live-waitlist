import React from 'react';
import { motion } from "framer-motion";
import TextBlur from "@/components/ui/text-blur";
import AnimatedShinyText from "@/components/ui/shimmer-text";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center rounded-full bg-muted/80 text-center">
            <AnimatedShinyText className="px-4 py-1">
              <span>Coming soon!</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      <motion.img
        src="/logo.png"
        alt="logo"
        className="mx-auto h-35 w-35"
        variants={itemVariants}
      />

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-3xl font-medium tracking-tighter sm:text-5xl"
          text="Spend 50% less time on email"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[27rem] pt-1.5 text-center text-base text-zinc-300 sm:text-lg"
          text="Automate your email with AI, bulk unsubscribe from newsletters, and block cold emails."
          duration={0.8}
        />
      </motion.div>

      {/* Added Backed By section */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col items-center mt-8 gap-2"
      >
        <span className="text-sm text-zinc-400">Backed by</span>
        <motion.img
          src="/aws.png"
          alt="AWS Logo"
          className="h-12 w-auto"
          variants={itemVariants}
        />
        <a 
          href="https://aws.amazon.com/startups/showcase/startup-details/8b83fabb-983a-46fb-8989-6dbb24ad5fa4" 
          className="text-xs text-white-500 hover:text-white-400 transition-colors"
        >
          vote here
        </a>
      </motion.div>
    </motion.div>
  );
}