const SectionHeaderDecoration = ({ title }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      {/* Greca Izquierda */}
      <svg
        width="70"
        height="22"
        viewBox="0 0 70 22"
        fill="none"
        className="text-[#526554] shrink-0"
      >
        <line
          x1="2"
          y1="19"
          x2="64"
          y2="19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M44 19V6L52 12V19M56 19V3L66 10V19"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <rect x="60" y="13" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      <h3 className="text-[#3A3A3A] text-base md:text-xl font-semibold tracking-wide px-2">
        {title}
      </h3>

      {/* Greca Derecha */}
      <svg
        width="70"
        height="22"
        viewBox="0 0 70 22"
        fill="none"
        className="text-[#526554] shrink-0"
      >
        <line
          x1="6"
          y1="19"
          x2="68"
          y2="19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M26 19V6L18 12V19M14 19V3L4 10V19"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <rect x="6" y="13" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
};
export default SectionHeaderDecoration;