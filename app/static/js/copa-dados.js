const equipesCopa = [
    ["A", "México", "MEX", "mx", "oitavas"],
    ["A", "África do Sul", "RSA", "za", "eliminada-oitavas"],
    ["A", "Coreia do Sul", "KOR", "kr", "eliminada-grupos"],
    ["A", "Tchéquia", "CZE", "cz", "eliminada-grupos"],
    ["B", "Canadá", "CAN", "ca", "classificada"],
    ["B", "Bósnia e Herzegovina", "BIH", "ba", "oitavas"],
    ["B", "Catar", "QAT", "qa", "eliminada-grupos"],
    ["B", "Suíça", "SUI", "ch", "oitavas"],
    ["C", "Brasil", "BRA", "br", "classificada"],
    ["C", "Marrocos", "MAR", "ma", "oitavas"],
    ["C", "Haiti", "HAI", "ht", "eliminada-grupos"],
    ["C", "Escócia", "SCO", "gb-sct", "eliminada-grupos"],
    ["D", "Estados Unidos", "USA", "us", "oitavas"],
    ["D", "Paraguai", "PAR", "py", "oitavas"],
    ["D", "Austrália", "AUS", "au", "oitavas"],
    ["D", "Turquia", "TUR", "tr", "eliminada-grupos"],
    ["E", "Alemanha", "GER", "de", "oitavas"],
    ["E", "Costa do Marfim", "CIV", "ci", "oitavas"],
    ["E", "Equador", "ECU", "ec", "oitavas"],
    ["E", "Curaçao", "CUW", "cw", "eliminada-grupos"],
    ["F", "Países Baixos", "NED", "nl", "oitavas"],
    ["F", "Japão", "JPN", "jp", "eliminada-oitavas"],
    ["F", "Suécia", "SWE", "se", "oitavas"],
    ["F", "Tunísia", "TUN", "tn", "eliminada-grupos"],
    ["G", "Bélgica", "BEL", "be", "oitavas"],
    ["G", "Egito", "EGY", "eg", "oitavas"],
    ["G", "Irã", "IRN", "ir", "eliminada-grupos"],
    ["G", "Nova Zelândia", "NZL", "nz", "eliminada-grupos"],
    ["H", "Espanha", "ESP", "es", "oitavas"],
    ["H", "Cabo Verde", "CPV", "cv", "oitavas"],
    ["H", "Arábia Saudita", "KSA", "sa", "eliminada-grupos"],
    ["H", "Uruguai", "URU", "uy", "eliminada-grupos"],
    ["I", "França", "FRA", "fr", "oitavas"],
    ["I", "Senegal", "SEN", "sn", "oitavas"],
    ["I", "Iraque", "IRQ", "iq", "eliminada-grupos"],
    ["I", "Noruega", "NOR", "no", "oitavas"],
    ["J", "Argentina", "ARG", "ar", "oitavas"],
    ["J", "Argélia", "ALG", "dz", "oitavas"],
    ["J", "Áustria", "AUT", "at", "oitavas"],
    ["J", "Jordânia", "JOR", "jo", "eliminada-grupos"],
    ["K", "Portugal", "POR", "pt", "oitavas"],
    ["K", "RD Congo", "COD", "cd", "oitavas"],
    ["K", "Uzbequistão", "UZB", "uz", "eliminada-grupos"],
    ["K", "Colômbia", "COL", "co", "oitavas"],
    ["L", "Inglaterra", "ENG", "gb-eng", "oitavas"],
    ["L", "Croácia", "CRO", "hr", "oitavas"],
    ["L", "Gana", "GHA", "gh", "oitavas"],
    ["L", "Panamá", "PAN", "pa", "eliminada-grupos"]
].map(([grupo, nome, codigo, bandeiraSvg, situacao]) => ({
    grupo, nome, codigo, bandeiraSvg, situacao
}));

const partidasTexto = `
1|2026-06-11|grupos|A|México|África do Sul|2–0|Cidade do México|encerrado
2|2026-06-11|grupos|A|Coreia do Sul|Tchéquia|2–1|Guadalajara|encerrado
3|2026-06-12|grupos|B|Canadá|Bósnia e Herzegovina|1–1|Toronto|encerrado
4|2026-06-12|grupos|D|Estados Unidos|Paraguai|4–1|Los Angeles|encerrado
5|2026-06-13|grupos|B|Catar|Suíça|1–1|San Francisco Bay Area|encerrado
6|2026-06-13|grupos|C|Brasil|Marrocos|1–1|Nova York/Nova Jersey|encerrado
7|2026-06-13|grupos|E|Costa do Marfim|Equador|1–0|Filadélfia|encerrado
8|2026-06-13|grupos|C|Haiti|Escócia|0–1|Boston|encerrado
9|2026-06-13|grupos|F|Suécia|Tunísia|5–1|Monterrey|encerrado
10|2026-06-14|grupos|D|Austrália|Turquia|2–0|Vancouver|encerrado
11|2026-06-14|grupos|E|Alemanha|Curaçao|7–1|Houston|encerrado
12|2026-06-14|grupos|F|Países Baixos|Japão|2–2|Dallas|encerrado
13|2026-06-15|grupos|H|Espanha|Cabo Verde|0–0|Atlanta|encerrado
14|2026-06-15|grupos|G|Bélgica|Egito|1–1|Seattle|encerrado
15|2026-06-15|grupos|H|Arábia Saudita|Uruguai|1–1|Miami|encerrado
16|2026-06-15|grupos|G|Irã|Nova Zelândia|2–2|Los Angeles|encerrado
17|2026-06-16|grupos|J|Argentina|Argélia|3–0|Kansas City|encerrado
18|2026-06-16|grupos|J|Áustria|Jordânia|3–1|San Francisco Bay Area|encerrado
19|2026-06-17|grupos|K|Portugal|RD Congo|1–1|Houston|encerrado
20|2026-06-16|grupos|I|França|Senegal|3–1|Nova York/Nova Jersey|encerrado
21|2026-06-17|grupos|L|Inglaterra|Croácia|4–2|Dallas|encerrado
22|2026-06-16|grupos|I|Iraque|Noruega|1–4|Boston|encerrado
23|2026-06-17|grupos|L|Gana|Panamá|1–0|Toronto|encerrado
24|2026-06-17|grupos|K|Uzbequistão|Colômbia|1–3|Cidade do México|encerrado
25|2026-06-18|grupos|A|Tchéquia|África do Sul|1–1|Atlanta|encerrado
26|2026-06-18|grupos|B|Suíça|Bósnia e Herzegovina|4–1|Los Angeles|encerrado
27|2026-06-18|grupos|B|Canadá|Catar|6–0|Vancouver|encerrado
28|2026-06-18|grupos|A|México|Coreia do Sul|1–0|Guadalajara|encerrado
29|2026-06-19|grupos|D|Estados Unidos|Austrália|2–0|Seattle|encerrado
30|2026-06-19|grupos|C|Escócia|Marrocos|0–1|Boston|encerrado
31|2026-06-19|grupos|E|Equador|Curaçao|0–0|Kansas City|encerrado
32|2026-06-19|grupos|C|Brasil|Haiti|3–0|Filadélfia|encerrado
33|2026-06-19|grupos|D|Turquia|Paraguai|0–1|San Francisco Bay Area|encerrado
34|2026-06-20|grupos|F|Países Baixos|Suécia|5–1|Houston|encerrado
35|2026-06-20|grupos|E|Alemanha|Costa do Marfim|2–1|Toronto|encerrado
36|2026-06-20|grupos|F|Tunísia|Japão|0–4|Monterrey|encerrado
37|2026-06-21|grupos|G|Bélgica|Irã|0–0|Los Angeles|encerrado
38|2026-06-21|grupos|H|Espanha|Arábia Saudita|4–0|Atlanta|encerrado
39|2026-06-21|grupos|H|Uruguai|Cabo Verde|2–2|Miami|encerrado
40|2026-06-21|grupos|G|Nova Zelândia|Egito|1–3|Vancouver|encerrado
41|2026-06-22|grupos|J|Argentina|Áustria|2–0|Dallas|encerrado
42|2026-06-22|grupos|I|França|Iraque|3–0|Filadélfia|encerrado
43|2026-06-23|grupos|L|Panamá|Croácia|0–1|Toronto|encerrado
44|2026-06-22|grupos|I|Noruega|Senegal|3–2|Nova York/Nova Jersey|encerrado
45|2026-06-23|grupos|K|Colômbia|RD Congo|1–0|Guadalajara|encerrado
46|2026-06-23|grupos|K|Portugal|Uzbequistão|5–0|Houston|encerrado
47|2026-06-23|grupos|L|Inglaterra|Gana|0–0|Boston|encerrado
48|2026-06-22|grupos|J|Jordânia|Argélia|1–2|San Francisco Bay Area|encerrado
49|2026-06-24|grupos|B|Suíça|Canadá|2–1|Vancouver|encerrado
50|2026-06-24|grupos|B|Bósnia e Herzegovina|Catar|3–1|Seattle|encerrado
51|2026-06-24|grupos|C|Escócia|Brasil|0–3|Miami|encerrado
52|2026-06-24|grupos|C|Marrocos|Haiti|4–2|Atlanta|encerrado
53|2026-06-25|grupos|F|Japão|Suécia|1–1|Dallas|encerrado
54|2026-06-25|grupos|F|Tunísia|Países Baixos|1–3|Kansas City|encerrado
55|2026-06-24|grupos|A|Tchéquia|México|0–3|Cidade do México|encerrado
56|2026-06-24|grupos|A|África do Sul|Coreia do Sul|1–0|Monterrey|encerrado
57|2026-06-25|grupos|D|Turquia|Estados Unidos|3–2|Los Angeles|encerrado
58|2026-06-25|grupos|D|Paraguai|Austrália|0–0|San Francisco Bay Area|encerrado
59|2026-06-25|grupos|E|Equador|Alemanha|2–1|Nova York/Nova Jersey|encerrado
60|2026-06-25|grupos|E|Curaçao|Costa do Marfim|0–2|Filadélfia|encerrado
61|2026-06-26|grupos|H|Cabo Verde|Arábia Saudita|0–0|Houston|encerrado
62|2026-06-26|grupos|H|Uruguai|Espanha|0–1|Guadalajara|encerrado
63|2026-06-26|grupos|G|Egito|Irã|1–1|Seattle|encerrado
64|2026-06-26|grupos|G|Nova Zelândia|Bélgica|1–5|Vancouver|encerrado
65|2026-06-26|grupos|I|Noruega|França|1–4|Boston|encerrado
66|2026-06-26|grupos|I|Senegal|Iraque|5–0|Toronto|encerrado
67|2026-06-27|grupos|K|Colômbia|Portugal|0–0|Miami|encerrado
68|2026-06-27|grupos|K|RD Congo|Uzbequistão|3–1|Atlanta|encerrado
69|2026-06-27|grupos|J|Argélia|Áustria|3–3|Kansas City|encerrado
70|2026-06-27|grupos|J|Jordânia|Argentina|1–3|Dallas|encerrado
71|2026-06-27|grupos|L|Panamá|Inglaterra|0–2|Nova York/Nova Jersey|encerrado
72|2026-06-27|grupos|L|Croácia|Gana|2–1|Filadélfia|encerrado
73|2026-06-28|32||África do Sul|Canadá|0–1|Los Angeles|encerrado|15:00 ET
74|2026-06-29|32||Alemanha|Paraguai||Boston|hoje|16:30 ET
75|2026-06-29|32||Países Baixos|Marrocos||Monterrey|hoje|21:00 ET
76|2026-06-29|32||Brasil|Japão|2–1|Houston|encerrado|13:00 ET
77|2026-06-30|32||França|Suécia||Nova York/Nova Jersey|agendado|17:00 ET
78|2026-06-30|32||Costa do Marfim|Noruega||Dallas|agendado|13:00 ET
79|2026-06-30|32||México|Equador||Cidade do México|agendado|21:00 ET
80|2026-07-01|32||Inglaterra|RD Congo||Atlanta|agendado|12:00 ET
81|2026-07-01|32||Estados Unidos|Bósnia e Herzegovina||San Francisco Bay Area|agendado|20:00 ET
82|2026-07-01|32||Bélgica|Senegal||Seattle|agendado|16:00 ET
83|2026-07-02|32||Portugal|Croácia||Toronto|agendado|19:00 ET
84|2026-07-02|32||Espanha|Áustria||Los Angeles|agendado|15:00 ET
85|2026-07-02|32||Suíça|Argélia||Vancouver|agendado|23:00 ET
86|2026-07-03|32||Argentina|Cabo Verde||Miami|agendado|14:00 ET
87|2026-07-03|32||Colômbia|Gana||Kansas City|agendado|18:00 ET
88|2026-07-03|32||Austrália|Egito||Dallas|agendado|21:30 ET
89|2026-07-04|16||Vencedor 74|Vencedor 77||Filadélfia|agendado|
90|2026-07-04|16||Canadá|Vencedor 75||Houston|agendado|
91|2026-07-05|16||Brasil|Vencedor 78||Nova York/Nova Jersey|agendado|
92|2026-07-05|16||Vencedor 79|Vencedor 80||Cidade do México|agendado|
93|2026-07-06|16||Vencedor 83|Vencedor 84||Dallas|agendado|
94|2026-07-06|16||Vencedor 81|Vencedor 82||Seattle|agendado|
95|2026-07-07|16||Vencedor 86|Vencedor 88||Atlanta|agendado|
96|2026-07-07|16||Vencedor 85|Vencedor 87||Vancouver|agendado|
97|2026-07-09|quartas||Vencedor 89|Vencedor 90||Boston|agendado|
98|2026-07-10|quartas||Vencedor 91|Vencedor 92||Los Angeles|agendado|
99|2026-07-11|quartas||Vencedor 93|Vencedor 94||Miami|agendado|
100|2026-07-11|quartas||Vencedor 95|Vencedor 96||Kansas City|agendado|
101|2026-07-14|semi||Vencedor 97|Vencedor 98||Dallas|agendado|
102|2026-07-15|semi||Vencedor 99|Vencedor 100||Atlanta|agendado|
103|2026-07-18|finais||Perdedor 101|Perdedor 102||Miami|agendado|
104|2026-07-19|finais||Vencedor 101|Vencedor 102||Nova York/Nova Jersey|agendado|
`.trim();

const partidasCopa = partidasTexto.split("\n").map((linha) => {
    const [numero, data, fase, grupo, mandante, visitante, placar, sede, status, horario = ""] =
        linha.split("|");
    return {
        numero: Number(numero),
        data,
        fase,
        grupo,
        mandante,
        visitante,
        placar,
        sede,
        status,
        horario
    };
});

window.COPA_DADOS = {
    atualizadoEm: "29 de junho de 2026, 16h21 (Brasília)",
    equipes: equipesCopa,
    partidas: partidasCopa
};
