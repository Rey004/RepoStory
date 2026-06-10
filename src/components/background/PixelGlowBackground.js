export default function PixelGlowBackground({ randomPixels = [] }) {
  return (
    <div className="bg-effects-layer absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.9)_3px,transparent_3px),linear-gradient(to_bottom,rgba(0,0,0,0.9)_3px,transparent_3px)] bg-[size:6px_6px] opacity-20" />

      <div className="absolute inset-0 pointer-events-none">
        {randomPixels.map((group) => (
          <div
            key={group.id}
            className="absolute pointer-events-none select-none"
            style={{
              top: group.top,
              left: group.left,
              opacity: group.opacity,
            }}
          >
            <div className="grid grid-cols-3 gap-1">
              {group.pixels.map((p, idx) =>
                p.visible ? (
                  <div
                    key={idx}
                    className={`w-3 h-3 bg-[#00ff66] animate-pixel-${p.animType}`}
                  />
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
