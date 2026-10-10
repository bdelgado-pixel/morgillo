"""Database configuration for local development and Render Postgres."""
from urllib.parse import parse_qs, unquote, urlsplit

from django.core.exceptions import ImproperlyConfigured


def database_config(environ, base_dir, *, debug=False):
    url = environ.get("DATABASE_URL", "").strip()
    engine = environ.get("DB_ENGINE", "sqlite").strip().lower()
    if not url and engine in {"sqlite", "sqlite3"}:
        return {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": base_dir / "db.sqlite3",
            "OPTIONS": {"timeout": 20},
        }
    if not url and engine not in {"postgres", "postgresql"}:
        raise ImproperlyConfigured("DB_ENGINE debe ser sqlite o postgres.")

    options = {"sslmode": environ.get("DB_SSLMODE", "prefer" if debug else "require")}
    try:
        if url:
            parsed = urlsplit(url)
            if parsed.scheme not in {"postgres", "postgresql"}:
                raise ValueError
            values = {
                "NAME": unquote(parsed.path.lstrip("/")),
                "USER": unquote(parsed.username or ""),
                "PASSWORD": unquote(parsed.password or ""),
                "HOST": parsed.hostname or "",
                "PORT": str(parsed.port or 5432),
            }
            allowed = {"sslmode", "sslrootcert", "sslcert", "sslkey", "connect_timeout"}
            query = parse_qs(parsed.query, keep_blank_values=True)
            if parsed.fragment or set(query) - allowed or any(len(v) != 1 for v in query.values()):
                raise ValueError
            options.update({key: value[0] for key, value in query.items()})
        else:
            values = {key: environ.get("DB_" + key, "") for key in ("NAME", "USER", "PASSWORD")}
            values.update(HOST=environ.get("DB_HOST", "127.0.0.1"), PORT=environ.get("DB_PORT", "5432"))
        if not all(values[key] for key in ("NAME", "USER", "HOST")):
            raise ValueError
        if not 1 <= int(values["PORT"]) <= 65535:
            raise ValueError
        if options["sslmode"] not in {"disable", "allow", "prefer", "require", "verify-ca", "verify-full"}:
            raise ValueError
        options["connect_timeout"] = int(options.get("connect_timeout", environ.get("DB_CONNECT_TIMEOUT", "10")))
        age = int(environ.get("DB_CONN_MAX_AGE", "60"))
        if options["connect_timeout"] <= 0 or age < 0:
            raise ValueError
    except (ValueError, TypeError):
        # Do not include the URL or password in errors or deployment logs.
        raise ImproperlyConfigured(
            "Conexión PostgreSQL inválida. Revisa DATABASE_URL o DB_NAME, DB_USER, "
            "DB_HOST, DB_PORT y las opciones SSL."
        ) from None
    return {
        "ENGINE": "django.db.backends.postgresql",
        **values,
        "CONN_MAX_AGE": age,
        "CONN_HEALTH_CHECKS": True,
        "DISABLE_SERVER_SIDE_CURSORS": environ.get("DB_DISABLE_SERVER_SIDE_CURSORS", "false").lower() in {"true", "1", "yes"},
        "OPTIONS": options,
    }
