import { Link } from 'react-router-dom';
import { useTitle } from '../lib/useMotion';

export function NotFound() {
  useTitle('Not found');
  return (
    <section className="notfound wrap" data-section="404">
      <p className="mono label">Error 404</p>
      <h1 className="display">Off the <em className="serif">map.</em></h1>
      <p className="dim">This part of the world hasn’t been built yet.</p>
      <Link to="/" className="btn btn--solid">Back to start</Link>
    </section>
  );
}
