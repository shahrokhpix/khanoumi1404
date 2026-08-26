type Props = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
};

export function PhotoFigure({ src, alt, caption, className = "" }: Props) {
  return (
    <figure className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="block w-full h-auto object-cover" />
      {caption ? (
        <figcaption className="bg-black/80 text-white text-sm px-4 py-3 leading-7">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

type AssetProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function FigmaAsset({ src, alt, width, height, className = "" }: AssetProps) {
  return (
    <span className={`inline-flex overflow-clip shrink-0 ${className}`} style={{ width, height }}>
      <img src={src} alt={alt} width={width} height={height} className="size-full object-contain" />
    </span>
  );
}
