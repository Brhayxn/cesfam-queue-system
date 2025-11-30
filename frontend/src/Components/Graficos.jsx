import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

import { Bar, Pie } from 'react-chartjs-2';

// Registra los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function TopDias({ reporte }) {
  // Transformar los datos del reporte al formato que Chart.js necesita
  const chartData = {
    labels: reporte.map(item => item.fecha), // Extrae las fechas
    datasets: [{
      label: 'Atenciones por día', // Título de la serie
      data: reporte.map(item => item.cantidad), // Extrae las cantidades
      backgroundColor: 'rgba(54, 162, 235, 0.6)', // Azul con transparencia
      borderColor: 'rgba(54, 162, 235, 1)', // Borde azul sólido
      borderWidth: 1 // Grosor del borde
    }]
  };

  // Opciones de configuración del gráfico
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Atenciones',
        font: {
          size: 18
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Atenciones: ${context.raw}`; // Personaliza el tooltip
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1 // Mostrar números enteros en el eje Y
        }
      }
    }
  };

  return <Bar key={JSON.stringify(chartData)} data={chartData} options={options} />;

}

export function TopCategorias({ data }) {
  // Ordenar las categorías alfabéticamente (C1, C2, C3...)
  const sortedData = [...data].sort((a, b) => a.categoria.localeCompare(b.categoria));

  const chartData = {
    labels: sortedData.map(item => item.categoria),
    datasets: [{
      label: 'Cantidad',
      data: sortedData.map(item => parseInt(item.cantidad)),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1,
      hoverOffset: 15 // Efecto al pasar el mouse
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Distribución por Categorías',
        font: {
          size: 18
        },
        padding: {
          top: 10,
          bottom: 20,
        }
      },
      legend: {
        position: 'right', // Puedes cambiar a 'top', 'bottom', 'left'
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    // Para animaciones suaves
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  
  return (
      <Pie key={JSON.stringify(chartData)} data={chartData} options={options} />
  )


}

export function GraficoHoras({ data }) {
  const chartData = {
    labels: data.map(item => item.hora),
    datasets: [{
      label: 'Atenciones por hora',
      data: data.map(item => item.cantidad),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      barThickness: 8 // barras delgadas
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // permite manejar altura personalizada
    plugins: {
      title: {
        display: true,
        text: 'Distribución de Atenciones por Hora',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: context => `Atenciones: ${context.raw}`
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar key={JSON.stringify(chartData)} data={chartData} options={options} />
    </div>
  );
}