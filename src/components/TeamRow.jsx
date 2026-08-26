export default function TeamRow({ title, members }) {
  return (
    <div className="mb-14 w-full items-center flex flex-col gap-2 sm:*: text-center">
      <h3 className="text-glow-pink mb-6 font-body text-lg font-semibold tracking-[0.3em] text-white sm:text-2xl">
        {title.toUpperCase()}
      </h3>

      <div className="mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-4 sm:gap-6">
        {members.map((m, i) => (
          <div
            key={i}
            className="flex w-[calc(50%-0.5rem)] flex-col items-center gap-3 py-4 px-2 text-center sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
          >
            <div
              className="h-25 w-25 rounded-full border-2 border-bs-pink/60 bg-gradient-to-br from-[#7a1f2b] to-[#3d0f16] bg-cover bg-center shadow-[0_0_12px_rgba(209,58,170,0.5)] transition duration-300 hover:scale-110 hover:border-bs-pink hover:shadow-[0_0_20px_rgba(209,58,170,0.85)] sm:h-35 sm:w-35"
              style={
                m.photo
                  ? { backgroundImage: `url(${m.photo})`, backgroundPosition: m.focus || "center" }
                  : undefined
              }
            />
            <div>
              <p className="font-body text-center text-xs font-semibold uppercase leading-tight text-white sm:text-sm">
                {m.name}
              </p>
              <p className="font-body text-[11px] text-bs-white/60 sm:text-xs">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
