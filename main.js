// all variables related to dimensions
const length = 800;

//legend data (if desire) and color scale
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

// Layout + node data prep
const root = d3.pack()
    .size([length, length])
    .padding(2)(hierarchyData);

const nodes = root.descendants();

//create SVG
const svg = d3.select("#chart").append("svg").attr("width", length ).attr("height", length );

//draw circles
const viz = svg.selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", d => "level" + d.height)
    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)

viz.append("circle")
    .attr("class", "circle")
    .attr("r", d => d.r)
    .attr("fill", d=>d.height===1?colorScale(d.data[0]):"white")
    .attr("opacity",d=>d.height===1?1:0.5)

// create a new set of group element so the text would be drawn on top all circles
const text = svg.selectAll("g.textNodes")
    .data(nodes)
    .join("g")
    .attr("class", d => "text" + d.height + " textNodes")
    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)

text.append("text")
    .attr("dy",3)
    .attr("text-anchor", "middle")
    .text(d => d.height === 1 ? d.data[0] : "");
