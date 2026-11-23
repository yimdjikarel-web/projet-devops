
const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 3000;

// Collecter automatiquement les statistiques de Node.js
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Compter le nombre de visites sur notre application
const httpRequests = new client.Counter({
    name: "http_requests_total",
    help: "Nombre total de requetes HTTP",
    labelNames: ["method", "route", "status"]
});

// Middleware pour compter les requêtes HTTP
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

// Page d'accueil
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Projet DevOps</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f1f5f9;
                    text-align: center;
                    padding: 80px 20px;
                }
                .container {
                    background: white;
                    max-width: 600px;
                    margin: auto;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                h1 { color: #2563eb; }
                p { color: #475569; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Bienvenue dans notre projet DevOps !</h1>
                <p>Notre application Node.js fonctionne correctement.</p>
                <p>Version : 1.0.0</p>
                <p>Serveur : devops-server</p>
            </div>
        </body>
        </html>
    `);
});

// Route de vérification de santé
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        application: "devops-web-app",
        version: "1.0.0"
    });
});

// Route des métriques pour Prometheus
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

// Démarrer le serveur
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application démarrée sur le port ${PORT}`);
});
