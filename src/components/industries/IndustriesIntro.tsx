import Reveal from "../Reveal";

// A standalone lede paragraph between the hero and the first industry
// section, so the hero photo/title can breathe on its own and this reads
// as a deliberate intro statement rather than text crowded onto the image.
export default function IndustriesIntro({
  description,
}: {
  description?: string;
}) {
  if (!description) return null;

  return (
    <section className="bg-neutral-950 px-5 pt-14 pb-2 text-white sm:px-10 sm:pt-20">
      <div className="mx-auto w-full max-w-[1800px]">
        <Reveal className="max-w-3xl border-l-2 border-accent pl-6 text-xl font-light leading-snug text-[#c1c7c7] sm:text-2xl">
          {description}
        </Reveal>
      </div>
    </section>
  );
}
