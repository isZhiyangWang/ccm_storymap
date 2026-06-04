function SkipLink({ onActivate }) {
  return (
    <a
      className="skip-link"
      href="#guided-map"
      onClick={(event) => {
        event.preventDefault();
        onActivate();
      }}
    >
      Skip to map
    </a>
  );
}

export default SkipLink;
