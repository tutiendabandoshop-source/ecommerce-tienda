import Link from "next/link";
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiMessageCircle } from "react-icons/fi";

const EMAIL = "mailto:aaroneli874@gmail.com";
const WHATSAPP_NUMBER = "529516111552";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
/* Enlaces temporales hasta tener URLs reales */
const INSTAGRAM_URL = "#";
const FACEBOOK_URL = "#";
const TWITTER_URL = "#";
const FAQ_URL = "#";
const HOW_TO_BUY_URL = "#";
const CONTACT_URL = "#";

const linkClass =
  "text-text-secondary transition-colors duration-200 hover:text-secondary hover:underline underline-offset-2 py-1 inline-block";

const socialIconClass =
  "text-text-secondary hover:text-secondary hover:scale-110 transition-all duration-200 ease-out inline-flex";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#F8F4F1]">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-4">
          {/* Columna 1: Logo/marca + descripción breve */}
          <div className="sm:max-w-xs">
            <h3 className="mb-3 font-serif text-xl font-semibold text-text-primary">
              Áurea
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Belleza y bienestar para tu día a día. Productos pensados para ti.
            </p>
          </div>

          {/* Columna 2: Enlaces de tienda */}
          <div>
            <h4 className="mb-4 font-sans font-semibold text-text-primary">
              Tienda
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop" className={linkClass}>
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass} aria-label="Ropa (próximamente)">
                  Ropa
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass} aria-label="Cuidado personal (próximamente)">
                  Cuidado personal
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass} aria-label="Accesorios (próximamente)">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Ayuda (FAQ, Cómo comprar, Contacto, email mailto, WhatsApp wa.me) */}
          <div>
            <h4 className="mb-4 font-sans font-semibold text-text-primary">
              Ayuda
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={FAQ_URL} className={linkClass} aria-label="Preguntas frecuentes (próximamente)">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href={HOW_TO_BUY_URL} className={linkClass} aria-label="Cómo comprar (próximamente)">
                  Cómo comprar
                </Link>
              </li>
              <li>
                <Link href={CONTACT_URL} className={linkClass} aria-label="Contacto (próximamente)">
                  Contacto
                </Link>
              </li>
              <li>
                <a
                  href={EMAIL}
                  className={`inline-flex items-center gap-2 py-1 ${linkClass}`}
                  aria-label="Enviar email"
                >
                  <FiMail size={18} className="shrink-0" />
                  <span className="break-all">aaroneli874@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 py-1 ${linkClass}`}
                  aria-label="Contactar por WhatsApp"
                >
                  <FiMessageCircle size={18} className="shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes sociales con iconos (react-icons/fi) */}
          <div>
            <h4 className="mb-4 font-sans font-semibold text-text-primary">
              Síguenos
            </h4>
            <div className="flex space-x-4">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialIconClass}
              >
                <FiFacebook size={20} />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialIconClass}
              >
                <FiInstagram size={20} />
              </a>
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className={socialIconClass}
              >
                <FiTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-300/60 text-center text-sm text-text-secondary">
          © {new Date().getFullYear()} Áurea. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
