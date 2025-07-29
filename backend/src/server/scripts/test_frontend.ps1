# Configuration des URLs
$apiBaseUrl = 'http://localhost:5000/api/joueurs'
$frontendBaseUrl = 'http://localhost:5173'

function Test-AllPlayers {
    Write-Host "[Test] Affichage de tous les joueurs..."
    try {
        $resp = Invoke-RestMethod -Method GET -Uri "$apiBaseUrl"
        if ($resp -is [System.Array]) {
            Write-Host "✅ GET /api/joueurs retourné $($resp.Length) joueurs"
        } else {
            Write-Error "❌ Réponse inattendue: pas un tableau"
        }
    } catch {
        Write-Error "❌ Échec GET /api/joueurs : $_"
    }
}

function Test-PlayersByPoste {
    param(
        [int]$posteId
    )
    Write-Host "[Test] Affichage joueurs poste #$posteId..."
    try {
        $resp = Invoke-RestMethod -Method GET -Uri "$apiBaseUrl/poste/$posteId"
        if ($resp -is [System.Array]) {
            Write-Host "✅ GET /api/joueurs/poste/$posteId retourné $($resp.Length) joueurs"
        } else {
            Write-Error "❌ Réponse inattendue: pas un tableau pour poste $posteId"
        }
    } catch {
        if ($_.Exception.Response.StatusCode.Value__ -eq 404) {
            Write-Host "⚠️ Aucun joueur trouvé pour le poste $posteId (404)"
        } else {
            Write-Error "❌ Erreur GET /api/joueurs/poste/$posteId : $_"
        }
    }
}

function Test-PlayerDetail {
    param(
        [int]$playerId
    )
    Write-Host "[Test] Affichage détail joueur #$playerId..."
    try {
        $resp = Invoke-RestMethod -Method GET -Uri "$apiBaseUrl/$playerId"
        if ($resp.id -eq $playerId) {
            Write-Host "✅ GET /api/joueurs/$playerId retourné le joueur $($resp.name)"
        } else {
            Write-Error "❌ L'ID retourné ($($resp.id)) ne correspond pas à $playerId"
        }
    } catch {
        if ($_.Exception.Response.StatusCode.Value__ -eq 404) {
            Write-Host "⚠️ Joueur $playerId non trouvé (404)"
        } else {
            Write-Error "❌ Erreur GET /api/joueurs/$playerId : $_"
        }
    }
}

function Test-CreatePlayer {
    Write-Host "[Test] Création d'un joueur (si implémenté)..."
    $body = @{
        name       = 'TestUser'
        posteId    = 1
        country    = 'TestLand'
        fifa_points= 50
    } | ConvertTo-Json
    try {
        $resp = Invoke-RestMethod -Method POST -Uri "$apiBaseUrl" -Body $body -ContentType 'application/json'
        Write-Host "✅ POST /api/joueurs réponse: $($resp | ConvertTo-Json -Depth 2)"
    } catch {
        if ($_.Exception.Response.StatusCode.Value__ -eq 404 -or $_.Exception.Response.StatusCode.Value__ -eq 501) {
            Write-Warning "⚠️ Endpoint POST /api/joueurs non implémenté ou non disponible"
        } else {
            Write-Error "❌ Erreur POST /api/joueurs : $_"
        }
    }
}

function Test-FrontendPages {
    Write-Host "[Test] Vérification des pages frontend..."
    $pages = @(
        '/',
        '/joueurs',
        '/joueurs/poste/1',
        '/joueurs/2'
    )
    foreach ($page in $pages) {
        $url = "$frontendBaseUrl$page"
        try {
            $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
            if ($resp.StatusCode -eq 200) {
                Write-Host "✅ Page '$page' accessible (200)"
            } else {
                Write-Warning "⚠️ Page '$page' status $($resp.StatusCode)"
            }
        } catch {
            Write-Error "❌ Impossible d'accéder à '$page' : $_"
        }
    }
}

# Exécution des tests
Test-AllPlayers
for ($i = 1; $i -le 11; $i++) { Test-PlayersByPoste -posteId $i }
Test-PlayerDetail -playerId 1
Test-FrontendPages
# Test-CreatePlayer # décommenter si nécessaire
