import { Provider } from "react-redux";
import { store } from "./store/store";

import { AppRouter } from "./routers/AppRouter";
import './styles/styles.css'

export const CalendarApp = () => {
  return (
    <Provider store={ store }>
      <AppRouter />
    </Provider>
  );
}
