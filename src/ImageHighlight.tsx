import 'ImageHighlight.css';

type Props = {
  rank: number,
  distance: number,
  close: any,
};

function ImageHighlight(props: Props) {
  const rank = props.rank;
  const distance = props.distance;
  const close = props.close;

  return (
    <div className="ImageHighlight-background">
      <div className="ImageHighlight-rank">Rank: {rank}</div>
      <div className="ImageHighlight-distance">Distance: {distance}</div>
      <div className="ImageHighlight-close" onClick={close} >Close</div>
    </div>
  );
}

export default ImageHighlight;
