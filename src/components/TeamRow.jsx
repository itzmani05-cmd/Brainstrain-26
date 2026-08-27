export default function TeamRow({ title, members, layout }) {
  return (
    <div className="mb-14 w-full items-center flex flex-col gap-2 sm:*: text-center">
      <h3 className="text-glow-pink mb-6 font-body text-lg font-semibold tracking-[0.3em] text-white sm:text-2xl 4xl:text-3xl 6xl:text-4xl 7xl:text-5xl">
        {title.toUpperCase()}
      </h3>

      <div
        className={`mx-auto w-full max-w-3xl justify-center gap-4 sm:gap-6 4xl:max-w-5xl 4xl:gap-10 6xl:max-w-6xl 6xl:gap-14 7xl:max-w-7xl 7xl:gap-16 ${
          layout === "two-over-three"
            ? "flex flex-wrap sm:grid sm:grid-cols-6"
            : "flex flex-wrap"
        }`}
      >
        {members.map((m, i) => (
          <div
            key={i}
            className={`flex w-[calc(50%-0.5rem)] flex-col items-center gap-3 px-2 py-4 text-center ${
              layout === "two-over-three"
                ? `sm:col-span-2 sm:w-auto ${i === 0 ? "sm:col-start-2" : i === 1 ? "sm:col-start-4" : ""}`
                : "sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
            }`}
          >
            <div
              className="h-25 w-25 rounded-full border-2 border-bs-pink/60 bg-gradient-to-br from-[#7a1f2b] to-[#3d0f16] bg-cover bg-center shadow-[0_0_12px_rgba(209,58,170,0.5)] transition duration-300 hover:scale-110 hover:border-bs-pink hover:shadow-[0_0_20px_rgba(209,58,170,0.85)] sm:h-35 sm:w-35 4xl:h-44 4xl:w-44 6xl:h-52 6xl:w-52 7xl:h-60 7xl:w-60"
              style={
                m.photo
                  ? { backgroundImage: `url(${m.photo})`, backgroundPosition: m.focus || "center" }
                  : undefined
              }
            />
            <div>
              <p className="font-body text-center text-xs font-semibold uppercase leading-tight text-white sm:text-sm 4xl:text-lg 6xl:text-xl 7xl:text-2xl">
                {m.name}
              </p>
              <p className="font-body text-[11px] text-bs-white/60 sm:text-xs 4xl:text-base 6xl:text-lg 7xl:text-xl">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
