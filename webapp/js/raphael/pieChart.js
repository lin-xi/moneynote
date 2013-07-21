Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                percentage = value / total,
                angleplus = 360 * percentage,
                popangle = angle + (angleplus / 2),
                color = Raphael.hsb(start, .75, 1),
                ms = 500,
                delta = 30,
                bcolor = Raphael.hsb(start, 1, 1),
                p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3}),
                txt1 = paper.text(cx + r*1.2 * Math.cos(-popangle * rad), cy + r*1.2 * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "#666", "font-size": 20}),
                txt2 = paper.text(cx + r*0.6 * Math.cos(-popangle * rad), cy + r*0.6 * Math.sin(-popangle * rad), Math.round(percentage*100)+'%').attr({fill: bcolor, stroke: "#000", "font-size": 20}),
                txt3 = paper.text(cx + r*0.85 * Math.cos(-popangle * rad), cy + r*0.85 * Math.sin(-popangle * rad), value+'元').attr({fill: bcolor, stroke: "#000", "font-size": 14});
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "backOut");
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt1);
            chart.push(txt2);
            chart.push(txt3);
            start += .1;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};
