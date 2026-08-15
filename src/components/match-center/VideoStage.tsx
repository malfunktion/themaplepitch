// TODO: wire to the real broadcast/embed URL once match data exists.
// Placeholder ID intentionally obvious rather than a real video, so it's
// impossible to mistake this for live content if it ships by accident.
const PLACEHOLDER_YOUTUBE_ID = 'jfKfPfyJRdk'; // public domain lofi stream, safe filler

export default function VideoStage() {
  return (
    <div className="mt-4 aspect-video w-full overflow-hidden rounded-sm border border-border">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${PLACEHOLDER_YOUTUBE_ID}`}
        title="Official stream placeholder"
        allowFullScreen
      />
    </div>
  );
}
