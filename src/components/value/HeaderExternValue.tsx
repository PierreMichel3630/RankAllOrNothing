import { StatsValue } from "src/models/Value";
import { THEMETMDB } from "src/routes/movieRoutes";
import { HeaderTmdb } from "./Header/HeaderTmdb";
import { HeaderTwitch } from "./Header/HeaderTwitch";
import { useParams } from "react-router-dom";

interface PropsExtern {
  onChangeTitle: (value: string) => void;
  stats?: StatsValue;
}

export const HeaderExternValue = ({ stats, onChangeTitle }: PropsExtern) => {
  let { theme } = useParams();

  const getHeaderTheme = () => {
    let body = <HeaderTwitch stats={stats} onChangeTitle={onChangeTitle} />;
    switch (Number(theme)) {
      case THEMETMDB:
        body = <HeaderTmdb stats={stats} onChangeTitle={onChangeTitle} />;
        break;
      case 7:
        body = <HeaderTwitch stats={stats} onChangeTitle={onChangeTitle} />;
        break;
    }
    return body;
  };

  return <>{getHeaderTheme()}</>;
};
