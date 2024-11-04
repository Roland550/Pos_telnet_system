import PropTypes from 'prop-types';

import { useSelector } from "react-redux";
export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  const themeClass = theme === 'light' ? 'bg-light text-dark' : 'bg-dark text-light';
  return (
    <div className={`min-vh-100 ${themeClass}`}>
      <div>
        {children}
      </div>
    </div>
  );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };