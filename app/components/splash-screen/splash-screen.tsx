import logo from "./imdex-logo.png";

export default function SplashScreen() {
  return (
    <div className="imdex-loader-wrapper">
      <div className="imdex-logo rounded p-4">
        <img className="imdex-img" src={logo} alt="Imdex" />
        <div className="imdex-spinner">
          <div className="imdex-double-bounce1"></div>
          <div className="imdex-double-bounce2"></div>
        </div>
      </div>
    </div>
  );
}
