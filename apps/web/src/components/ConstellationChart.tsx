'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { Transaction } from '@daily-expanss/shared';

interface ConstellationChartProps {
  transactions: Transaction[];
}

interface Star {
  x: number;
  y: number;
  r: number;
  amount: number;
  description: string;
  category: string;
}

export function ConstellationChart({ transactions }: ConstellationChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 600;
    const height = 300;
    const expenses = transactions.filter((t) => t.type === 'expense');

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // Background
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', 'rgba(11,12,16,0.0)').attr('rx', 12);

    if (expenses.length === 0) {
      svg.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle').attr('fill', 'rgba(242,233,228,0.3)').attr('font-size', 14).text('No expense data to display');
      return;
    }

    const maxAmount = d3.max(expenses, (d) => d.amount) ?? 1;
    const rScale = d3.scaleSqrt().domain([0, maxAmount]).range([3, 18]);

    // Randomly position stars with some structure
    const stars: Star[] = expenses.map((t, i) => ({
      x: 40 + Math.random() * (width - 80),
      y: 30 + (Math.sin(i * 1.2) * 0.4 + 0.5) * (height - 60),
      r: rScale(t.amount),
      amount: t.amount,
      description: t.description,
      category: t.category,
    }));

    // Draw constellation lines (connect nearby stars)
    const lineGroup = svg.append('g');
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
        if (dist < 120) {
          lineGroup.append('line')
            .attr('x1', stars[i].x).attr('y1', stars[i].y)
            .attr('x2', stars[j].x).attr('y2', stars[j].y)
            .attr('stroke', 'rgba(197,160,101,0.15)')
            .attr('stroke-width', 1);
        }
      }
    }

    // Draw stars
    const starGroup = svg.append('g');
    stars.forEach((star) => {
      const g = starGroup.append('g').attr('cursor', 'pointer');

      // Glow effect
      g.append('circle').attr('cx', star.x).attr('cy', star.y).attr('r', star.r + 4)
        .attr('fill', 'rgba(197,160,101,0.1)');

      g.append('circle').attr('cx', star.x).attr('cy', star.y).attr('r', star.r)
        .attr('fill', '#C5A065').attr('opacity', 0.8)
        .on('mouseenter', function () {
          d3.select(this).transition().duration(200).attr('r', star.r * 1.4).attr('opacity', 1);
          tooltip.style('opacity', '1').html(`<strong>${star.description}</strong><br/>৳${star.amount.toFixed(0)}`);
        })
        .on('mousemove', (event) => {
          tooltip.style('left', `${event.offsetX + 12}px`).style('top', `${event.offsetY - 12}px`);
        })
        .on('mouseleave', function () {
          d3.select(this).transition().duration(200).attr('r', star.r).attr('opacity', 0.8);
          tooltip.style('opacity', '0');
        });
    });

    // Tooltip
    const tooltip = d3.select(svgRef.current.parentElement!)
      .append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(26,26,46,0.95)')
      .style('border', '1px solid rgba(197,160,101,0.3)')
      .style('border-radius', '8px')
      .style('padding', '8px 12px')
      .style('color', '#F2E9E4')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', '0')
      .style('transition', 'opacity 0.2s')
      .style('z-index', '10');

    return () => { tooltip.remove(); };
  }, [transactions]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: 300, display: 'block' }} />
    </div>
  );
}
