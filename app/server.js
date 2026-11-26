
const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 3000;

// Collecte automatique des statistiques Node.js
client.collectDefaultMetrics();

// Compteur des requêtes HTTP
const httpRequests = new client.Counter({
    name: "http_requests_total",
    help: "Nombre total de requetes HTTP",
    labelNames: ["method", "route", "status"]
});

// Middleware de suivi des requêtes
app.use((req, res, next) => {
    res.on("finish", () => {
        httpRequests.inc({
            method: req.method,
            route: req.path,
            status: res.statusCode
        });
    });
    next();
});

// Tableau de bord principal
app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevOps Monitor | Tableau de bord</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: #0b1120;
            color: #e2e8f0;
            min-height: 100vh;
        }

        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 245px;
            height: 100vh;
            background: #111827;
            border-right: 1px solid #253047;
            padding: 30px 20px;
        }

        .logo {
            font-size: 23px;
            font-weight: bold;
            color: white;
            margin-bottom: 45px;
        }

        .logo span {
            color: #38bdf8;
        }

        .menu-title {
            color: #64748b;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 25px 0 15px;
        }

        .menu-item {
            display: block;
            padding: 13px;
            margin-bottom: 8px;
            border-radius: 8px;
            color: #94a3b8;
            font-size: 14px;
            text-decoration: none;
            transition: 0.2s;
        }

        .menu-item:hover {
            background: #1e293b;
            color: #38bdf8;
        }

        .menu-item.active {
            background: #1e3a5f;
            color: #38bdf8;
        }

        .sidebar-footer {
            position: absolute;
            bottom: 25px;
            color: #64748b;
            font-size: 12px;
            line-height: 1.7;
        }

        .main {
            margin-left: 245px;
            padding: 35px;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 35px;
        }

        .topbar h1 {
            font-size: 25px;
            color: white;
        }

        .topbar p {
            color: #94a3b8;
            margin-top: 8px;
            font-size: 13px;
        }

        .status-pill {
            background: #12372e;
            color: #4ade80;
            border: 1px solid #166534;
            border-radius: 30px;
            padding: 10px 16px;
            font-size: 12px;
        }

        .welcome {
            background: linear-gradient(115deg, #172d50, #123b50);
            border: 1px solid #285477;
            padding: 32px;
            border-radius: 16px;
            margin-bottom: 30px;
        }

        .welcome small {
            color: #7dd3fc;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .welcome h2 {
            font-size: 27px;
            margin: 14px 0;
            color: white;
        }

        .welcome p {
            color: #cbd5e1;
            line-height: 1.7;
            max-width: 650px;
            font-size: 14px;
        }

        .section-title {
            font-size: 17px;
            margin-bottom: 18px;
            color: white;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
            margin-bottom: 35px;
        }

        .card {
            background: #111c2e;
            border: 1px solid #253047;
            border-radius: 13px;
            padding: 23px;
        }

        .card-label {
            color: #94a3b8;
            font-size: 13px;
        }

        .card-value {
            color: white;
            font-size: 29px;
            font-weight: bold;
            margin: 17px 0 8px;
        }

        .card-note {
            color: #64748b;
            font-size: 12px;
        }

        .services {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
        }

        .service {
            background: #111c2e;
            border: 1px solid #253047;
            border-radius: 13px;
            padding: 22px;
            transition: 0.2s;
        }

        .service:hover {
            transform: translateY(-4px);
            border-color: #38bdf8;
        }

        .service-icon {
            font-size: 27px;
            margin-bottom: 17px;
        }

        .service h3 {
            color: white;
            font-size: 16px;
            margin-bottom: 9px;
        }

        .service p {
            color: #94a3b8;
            font-size: 12px;
            line-height: 1.6;
        }

        .tag {
            display: inline-block;
            margin-top: 16px;
            padding: 6px 10px;
            border-radius: 20px;
            background: #1e293b;
            color: #7dd3fc;
            font-size: 10px;
        }

        .footer {
            border-top: 1px solid #253047;
            margin-top: 40px;
            padding-top: 22px;
            color: #64748b;
            font-size: 12px;
            text-align: center;
        }

        html {
            scroll-behavior: smooth;
        }

        @media (max-width: 900px) {
            .sidebar {
                display: none;
            }

            .main {
                margin-left: 0;
                padding: 22px;
            }

            .stats, .services {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 550px) {
            .stats, .services {
                grid-template-columns: 1fr;
            }

            .topbar {
                align-items: flex-start;
                flex-direction: column;
            }

            .welcome h2 {
                font-size: 22px;
            }
        }
    </style>
</head>

<body>

    <aside class="sidebar">
        <div class="logo">DevOps<span>.</span>Monitor</div>

        <div class="menu-title">Principal</div>
        <a href="#accueil" class="menu-item active">▦ Tableau de bord</a>
        <a href="#supervision" class="menu-item">◉ Supervision</a>
        <a href="#infrastructure" class="menu-item">▤ Infrastructure</a>

        <div class="menu-title">Technologies</div>
        <a href="#docker" class="menu-item">🐳 Docker</a>
        <a href="http://localhost:9090" target="_blank" rel="noopener noreferrer" class="menu-item">📊 Prometheus ↗</a>
        <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" class="menu-item">📈 Grafana ↗</a>

        <div class="sidebar-footer">
            Projet DevOps<br>
            Environnement Ubuntu 24.04
        </div>
    </aside>

    <!-- IDENTIFIANT ACCUEIL -->
    <main class="main" id="accueil">

        <header class="topbar">
            <div>
                <h1>Tableau de borde....</h1>
                <p>Vue générale de votre infrastructure DevOps</p>
            </div>

            <div class="status-pill" id="status">
                ● Vérification...
            </div>
        </header>

        <section class="welcome">
            <small>Plateforme de supervision</small>
            <h2>Bienvenue sur DevOps Monitor</h2>
            <p>
                Surveillez votre application et découvrez les technologies
                qui composent votre infrastructure. Cette plateforme
                présente votre environnement de déploiement et de monitoring.
            </p>
        </section>

        <h2 class="section-title">Indicateurs de l'application</h2>

        <!-- IDENTIFIANT SUPERVISION -->
        <section class="stats" id="supervision">
            <div class="card">
                <div class="card-label">État de l'application</div>
                <div class="card-value" id="app-status">...</div>
                <div class="card-note">Vérification du service HTTP</div>
            </div>

            <div class="card">
                <div class="card-label">Requêtes HTTP</div>
                <div class="card-value" id="requests">...</div>
                <div class="card-note">Total des requêtes comptabilisées</div>
            </div>

            <div class="card">
                <div class="card-label">Version</div>
                <div class="card-value" id="version">...</div>
                <div class="card-note">Version de l'application</div>
            </div>
        </section>

        
<h2 class="section-title">Technologies de notre infrastructure</h2>

<section class="services" id="infrastructure">

    <!-- DOCKER -->
    <article class="service service-docker" id="docker">

        <div class="service-header">
            <div class="service-icon docker-icon">🐳</div>
            <span class="service-badge">Conteneurisation</span>
        </div>

        <h2>Docker</h2>
        <p class="service-subtitle">Plateforme de conteneurisation</p>

        <p class="service-description">
            Docker permet de construire, déployer et exécuter
            notre application dans des conteneurs isolés.
            Il facilite la gestion des services et garantit
            un environnement d'exécution cohérent.
        </p>

        <div class="service-features">
            <div>✓ Création des images Docker</div>
            <div>✓ Exécution des conteneurs</div>
            <div>✓ Gestion avec Docker Compose</div>
        </div>

        <div class="service-footer">
            <span>Infrastructure applicative</span>
            <a href="https://docs.docker.com/" target="_blank">
                Documentation ↗
            </a>
        </div>

    </article>


    <!-- PROMETHEUS -->
    <article class="service service-prometheus" id="prometheus">

        <div class="service-header">
            <div class="service-icon prometheus-icon">📊</div>
            <span class="service-badge">Monitoring</span>
        </div>

        <h2>Prometheus</h2>
        <p class="service-subtitle">Collecte et stockage des métriques</p>

        <p class="service-description">
            Prometheus collecte les données de performance
            de notre application et de notre infrastructure.
            Il permet de surveiller les services et de détecter
            les éventuelles anomalies.
        </p>

        <div class="service-features">
            <div>✓ Collecte des métriques HTTP</div>
            <div>✓ Surveillance des services</div>
            <div>✓ Analyse avec PromQL</div>
        </div>

        <div class="service-footer">
            <span>Collecte des données</span>
            <a href="http://localhost:9090" target="_blank">
                Ouvrir Prometheus ↗
            </a>
        </div>

    </article>


    <!-- GRAFANA -->
    <article class="service service-grafana" id="grafana">

        <div class="service-header">
            <div class="service-icon grafana-icon">📈</div>
            <span class="service-badge">Visualisation</span>
        </div>

        <h2>Grafana</h2>
        <p class="service-subtitle">Visualisation des performances</p>

        <p class="service-description">
            Grafana transforme les métriques collectées
            par Prometheus en graphiques et tableaux de bord.
            Il facilite l'analyse et le suivi des performances
            de notre infrastructure.
        </p>

        <div class="service-features">
            <div>✓ Tableaux de bord interactifs</div>
            <div>✓ Graphiques et statistiques</div>
            <div>✓ Suivi des performances</div>
        </div>

        <div class="service-footer">
            <span>Analyse et visualisation</span>
            <a href="http://localhost:3001" target="_blank">
                Ouvrir Grafana ↗
            </a>
        </div>

    </article>

</section>
