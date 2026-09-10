import { ArrowRight, MapPinned } from "lucide-react";

type PlaceFinderProps = {
  compact?: boolean;
};

export function PlaceFinder({ compact = false }: PlaceFinderProps) {
  return (
    <div className={`place-finder${compact ? " place-finder--compact" : ""}`}>
      <a className="place-finder-input" href="/places/">
        <MapPinned size={18} aria-hidden="true" />
        <span>Browse published local profiles</span>
        <ArrowRight size={17} aria-hidden="true" />
      </a>
    </div>
  );
}
