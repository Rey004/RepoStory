export default function LandingAmbientGlow() {
  return (
    <>
      {/* Side glows — much dimmer and narrower on mobile/tablet */}
      <div className="absolute left-0 top-1/6 bottom-1/6 w-12 sm:w-10 md:w-48 bg-gradient-to-r from-[#00ff66]/6 sm:from-[#00ff66]/10 md:from-[#00ff66]/18 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute right-0 top-1/6 bottom-1/6 w-12 sm:w-10 md:w-48 bg-gradient-to-l from-[#00ff66]/6 sm:from-[#00ff66]/10 md:from-[#00ff66]/18 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Top radial glow — smaller and dimmer on mobile/tablet */}
      <div
        className="absolute top-[-60px] sm:top-[-80px] left-1/2 -translate-x-1/2
                   w-[400px] h-[220px]
                   sm:w-[620px] sm:h-[360px]
                   md:w-[900px] md:h-[500px]
                   pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0, 255, 102, 0.05) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-[-60px] sm:top-[-80px] left-1/2 -translate-x-1/2
                   hidden sm:block
                   w-[620px] h-[360px]
                   md:w-[900px] md:h-[500px]
                   pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0, 255, 102, 0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2
                   hidden md:block
                   w-[900px] h-[500px]
                   pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0, 255, 102, 0.05) 0%, transparent 65%)",
        }}
      />
    </>
  );
}
