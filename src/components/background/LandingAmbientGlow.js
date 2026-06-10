export default function LandingAmbientGlow() {
  return (
    <>
      <div className="absolute left-0 top-1/6 bottom-1/6 w-24 md:w-48 bg-gradient-to-r from-[#00ff66]/18 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute right-0 top-1/6 bottom-1/6 w-24 md:w-48 bg-gradient-to-l from-[#00ff66]/18 to-transparent blur-3xl pointer-events-none z-0" />
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0, 255, 102, 0.12) 0%, transparent 65%)",
        }}
      />
    </>
  );
}
