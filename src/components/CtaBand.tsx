import CtaButton from "./CtaButton";

export default function CtaBand({
  locale = "en",
}: {
  locale?: "en" | "sq";
} = {}) {
  return (
    <section className="bg-neutral-950 px-5 py-4 sm:px-10">
      <div className="relative mx-auto flex w-full max-w-[1800px] flex-col justify-center overflow-hidden rounded-2xl bg-neutral-900 px-5 py-10 text-white sm:px-12 sm:py-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.figma.com/api/mcp/asset/ca60b168-5c92-4d4f-9a72-62b2b5fc2f64.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 to-black/80" />

        <div className="relative z-10 flex max-w-3xl flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2
              className="font-light leading-tight text-[#c1c7c7]"
              style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
            >
              {locale === "sq"
                ? "Na tregoni për vizionin tuaj. Le ta zhvillojmë së bashku."
                : "Let's shape your vision, together."}
            </h2>
            <p className="text-xl font-light leading-snug text-[#eaefef]">
              {locale === "sq"
                ? "Duam të dimë më shumë rreth projektit tuaj"
                : "We want to know more about your project"}
            </p>
          </div>
          <CtaButton
            label={locale === "sq" ? "NA KONTAKTONI!" : "Get in Touch"}
            href="#"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
