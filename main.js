
//legend data and color scale
const legendData = [{"category":"Critically Endangered","color":"#b30000"},{"category":"Endangered","color":"#e34a33"},{"category":"Vulnerable","color":"#fc8d59"},{"category":"Near Threatened","color":"#fdbb84"},{"category":"Least Concern","color":"#fdd49e"},{"category":"Data Deficient","color":"#d9d9d9"}];
const categories = legendData.map(d => d.category)
const colors = legendData.map(d => d.color)
const colorScale = d3.scaleOrdinal().domain(categories).range(colors);

//convert data to hierarchical format
const groupingFn = [d => d.redlistCategory,d=>d.scientificName];
const rollupData = d3.rollup(data, v => v.length, ...groupingFn);
const childrenAccessorFn = ([key, value]) => value.size && Array.from(value);
const hierarchyData = d3.hierarchy(rollupData, childrenAccessorFn)
    .sum(([key, value]) => value)
    .sort((a, b) => b.value - a.value)

// all variables related to dimensions
const length = 800;

// Layout + node data prep
const root = d3.pack()
    .size([length, length])
    .padding(2)(hierarchyData);

const nodes = root.descendants();

//create SVG & G
const svg = d3.select("#chart").append("svg").attr("width", length ).attr("height", length );

const chartG = svg.append("g").attr("class", "chartWrapper");


//draw circles
const viz = chartG.selectAll("g.nodes")
    .data(nodes)
    .join("g")
    .attr("class", d => "level" + d.height + " nodes")
    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)

viz.append("circle")
    .attr("class", "circle")
    .attr("r", d => d.r)
    .attr("fill", "none");

d3.selectAll(".level0 circle") //most inner circles are level0
    .attr("fill", "white")
    .attr("opacity",0.5)
    .attr("stroke-width", 1);

d3.selectAll(".level1 circle")
.attr("fill", d => colorScale(d.data[0]))
    .attr("stroke", "white")
    .attr("stroke-width", 1);

// if I don't create a new set of gs and join the text directly to the prevous g,the text would be drawn under the circles
const text = chartG.selectAll("g.textNodes")
    .data(nodes)
    .join("g")
    .attr("class", d => "text" + d.height + " textNodes")
    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)

text.append("text")
    .attr("class", "text")
    .attr("font-size", 14)
    .attr("font-weight",700)
    .attr("text-anchor", "middle")
    .attr("dy",3)
    .text(d => d.height === 1 ? d.data[0] : "");
