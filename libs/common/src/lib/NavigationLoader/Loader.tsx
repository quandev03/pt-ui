// export const Loader = () => {
//   return <div className="loader"></div>;
// };
import Logo from '../../assets/images/Logo-mini.svg';
export const Loader = () => {
  return (
    <div className="loading-overlay">
      <img
        src={Logo}
        alt="Website Logo"
        className="logo-fade"
        style={{ width: '100px' }}
      />
      <div className="dot-flashing"></div>
    </div>
  );
};
