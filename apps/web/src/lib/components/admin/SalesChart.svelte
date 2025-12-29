<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  interface Props {
    data?: number[];
    categories?: string[];
    type?: 'line' | 'bar' | 'area';
    height?: number;
    color?: string;
  }

  let {
    data = [30, 40, 35, 50, 49, 60, 70, 91, 125],
    categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    type = 'area',
    height = 300,
    color = '#2563eb' // Default primary blue
  }: Props = $props();

  let chartElement: HTMLElement;
  let chart: any = null; // Use any to avoid complex type import issues with dynamic import

  $effect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined' && chartElement) {
        (async () => {
            try {
                const module = await import('apexcharts');
                const ApexCharts = module.default;

                // Destroy existing chart if it exists to prevent duplicates on re-render
                if (chart) {
                    chart.destroy();
                }

                const options = {
                    series: [{
                        name: 'Revenue',
                        data: data
                    }],
                    chart: {
                        type: type,
                        height: height,
                        fontFamily: 'Inter, sans-serif',
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    xaxis: {
                        categories: categories,
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false
                        },
                        labels: {
                            style: {
                                colors: '#64748b',
                                fontSize: '12px'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: '#64748b',
                                fontSize: '12px'
                            },
                            formatter: (value: number) => {
                                return new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(value);
                            }
                        }
                    },
                    grid: {
                        borderColor: '#e2e8f0', // slate-200
                        strokeDashArray: 4,
                        yaxis: {
                            lines: {
                                show: true
                            }
                        }
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.4,
                            opacityTo: 0.05,
                            stops: [0, 90, 100]
                        }
                    },
                    colors: [color],
                    tooltip: {
                        theme: 'light', 
                        y: {
                            formatter: function (val: number) {
                                 return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);
                            }
                        }
                    }
                };

                // Dark mode adaptation (basic)
                if (document.documentElement.classList.contains('dark')) {
                    options.grid.borderColor = '#334155'; // slate-700
                    options.xaxis.labels.style.colors = '#94a3b8'; // slate-400
                    options.yaxis.labels.style.colors = '#94a3b8'; // slate-400
                    options.tooltip.theme = 'dark';
                }

                chart = new ApexCharts(chartElement, options);
                chart.render();
            } catch (e) {
                console.error("Failed to load chart", e);
            }
        })();

        return () => {
            chart?.destroy();
        };
    }
  });

</script>

<div class="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 p-6">
    <div class="flex items-center justify-between mb-4">
        <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Sales Overview</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">Monthly revenue statistics</p>
        </div>
        <!-- Minimal Filter for visual purposes -->
        <select class="text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Last 6 Months</option>
            <option>Last Year</option>
        </select>
    </div>
    
    <div bind:this={chartElement} class="w-full"></div>
</div>
