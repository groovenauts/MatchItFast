import 'Highlight.css';

type Props = {
  close: any,
};

function Highlight(props: Props) {
  const close = props.close;

  return (
    <div className="Highlight-background">
      <div className="Highlight-close" onClick={close} >Close</div>
    </div>
  );
}

export default Highlight;
