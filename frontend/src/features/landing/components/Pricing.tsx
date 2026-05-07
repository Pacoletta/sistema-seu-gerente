"use client";

import { buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Planos que cabem no seu orçamento",
  description = "Escolha o plano ideal para o tamanho do seu condomínio",
}: PricingProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="w-full py-20 px-4">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
          {title}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="flex justify-center items-center">
        <div className="max-w-md w-full">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={
                isDesktop
                  ? {
                      y: 0,
                      opacity: 1,
                      scale: 1.0,
                    }
                  : { y: 0, opacity: 1 }
              }
              viewport={{ once: true }}
              transition={{
                duration: 1.6,
                type: "spring",
                stiffness: 100,
                damping: 30,
                delay: index * 0.2,
                opacity: { duration: 0.5 },
              }}
              className={cn(
                `rounded-2xl border p-8 bg-white/90 backdrop-blur-sm text-center flex flex-col relative transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2`,
                plan.isPopular
                  ? "border-purple-400 border-2 bg-linear-to-br from-purple-50 to-violet-50 shadow-xl z-10"
                  : "border-purple-200 shadow-lg z-0",
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-linear-to-r from-purple-600 to-violet-600 py-2 px-6 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <Star className="text-white h-4 w-4 fill-current" />
                      <span className="text-white text-sm font-bold whitespace-nowrap">
                        Mais Popular
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col">
                <p
                  className={cn(
                    "text-xl font-bold mb-4 mt-2",
                    plan.isPopular ? "text-purple-700" : "text-gray-900",
                  )}
                >
                  {plan.name}
                </p>

                <div className="mt-2 mb-3 flex items-center justify-center gap-x-1">
                  <span
                    className={cn(
                      "text-5xl font-bold tracking-tight",
                      plan.isPopular ? "text-purple-700" : "text-gray-900",
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-base text-gray-600 ml-1">
                      / {plan.period}
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-3 mb-8 flex-1 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check
                        className={cn(
                          "h-5 w-5 mt-0.5 shrink-0",
                          plan.isPopular ? "text-purple-600" : "text-green-600",
                        )}
                      />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={cn(
                    "w-full py-4 text-base font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl mt-auto",
                    plan.isPopular
                      ? "bg-linear-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
                      : "bg-purple-600 text-white hover:bg-purple-700",
                  )}
                >
                  {plan.buttonText}
                </Link>

                <p className="mt-4 text-xs text-gray-500">{plan.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
