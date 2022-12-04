import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import renderRoutes from './renderRoutes/renderRoutes';
import routes from './routes';

const RouterContainer = () => {
  return (
    <Router>
      <Switch>
        {renderRoutes({
            routes: routes,
          })}
      </Switch>
    </Router>
  );
};

export default RouterContainer;
