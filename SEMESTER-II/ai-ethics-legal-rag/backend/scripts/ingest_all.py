"""Bilgi tabanını sıfırdan kurma scripti."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.knowledge.ingest import main  # noqa: E402

if __name__ == "__main__":
    main()
