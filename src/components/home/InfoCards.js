import AboutCard from "@/components/home/AboutCard";
import PipelineCard from "@/components/home/PipelineCard";

export default function InfoCards() {
  return (
    <div className="w-full max-w-xs sm:max-w-4xl mx-auto flex flex-col lg:flex-row gap-3 sm:gap-6 items-stretch animate-fade-in-delay-300">
      <AboutCard />
      <PipelineCard />
    </div>
  );
}
