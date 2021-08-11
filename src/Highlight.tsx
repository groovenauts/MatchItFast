import 'Highlight.css';

type Props = {
  rank: number,
  distance: number,
  close: any,
};

function Highlight(props: Props) {
  const rank = props.rank;
  const distance = props.distance;
  const close = props.close;

  return (
    <div className="Highlight-background">
      <div className="Highlight-rank">Rank: {rank}</div>
      <div className="Highlight-distance">Distance: {distance}</div>
      <div className="Highlight-close" onClick={close} >Close</div>
    </div>
  );
}

export default Highlight;
