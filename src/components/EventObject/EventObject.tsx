import { UniqueIdentifier } from "@dnd-kit/core";
import { StylesConfig } from "react-select";
import Select from "react-select";

type Game = { label: string; value: string; image: string };

const games: Game[] = [
  { label: "Dragon Ball Super W", value: "dbsw", image: "/games-logos/dbsw.png" },
  { label: "Dragon Ball Super B", value: "dbsb", image: "/games-logos/dbsb.png" },
  { label: "Magic: the Gathering", value: "mtg", image: "/games-logos/mtg.png" },
  { label: "Flesh & Blood", value: "fab", image: "/games-logos/fab.png" },
  { label: "Yu-Gi-Oh!", value: "ygo", image: "/games-logos/ygu.png" },
  { label: "Vanguard", value: "vng", image: "/games-logos/vng.png" },
  { label: "One Piece", value: "op", image: "/games-logos/op.png" },
  { label: "Pokémon", value: "pkm", image: "/games-logos/pkm.png" },
  { label: "Lorcana", value: "lcn", image: "/games-logos/lcn.png" },
];

const dotStyles: StylesConfig<Game> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles) => ({ ...styles, backgroundColor: "white" }),
  input: (styles) => ({ ...styles, height: "80px" }),
  singleValue: (styles) => ({ ...styles, width: "100%" }),
  container: (styles) => ({ ...styles, width: "100%" }),
  // menu: (styles) => ({ ...styles, backgroundColor: "black", position: "relative" }),
  menuPortal: (styles) => ({ ...styles, zIndex: 99999 }),
};

const defaultInitializer = (index: number) => index;

export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

export type ItemsType = {
  // Dynamic keys with number[] or string[] as values
  [key: string]: UniqueIdentifier[];
};

const itemCount = 3;

const items = {
  A: createRange(itemCount, (index) => index * 1 + 2),
  B: createRange(itemCount, (index) => index * 2 + 5),
  C: createRange(itemCount, (index) => index * 3 + 8),
  // D: createRange(itemCount, (index) => `D${index + 1}`)
} as ItemsType;

export const EventObject = (containerRef?: React.Ref<HTMLDivElement>) => {
  if (!items) {
    return <div>no items</div>;
  }

  return Object.values(items).map((item) => (
    <Select
      menuPlacement="auto"
      maxMenuHeight={200}
      menuPortalTarget={containerRef?.current || document.body} // Defaults to `document.body` if ref is undefined
      styles={dotStyles}
      options={games}
      defaultValue={games[0]}
      formatOptionLabel={(game) => (
        <div
          className="game-option"
          style={{
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={game.image} style={{ height: "60px" }} alt={`${game.label}-image`} />
        </div>
      )}
    />
  ));
};
