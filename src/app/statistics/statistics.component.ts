import { Component, AfterViewInit, OnInit } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';
import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  // Define interfaces for stats to ensure type safety
  requestStats: { pending?: number; approved?: number; rejected?: number } = {};
  roleStats: { admin?: number; manager?: number; employee?: number } = {};
  departmentStats: { [key: string]: number } = {};
  trendStats: { [key: string]: number } = {};
  private charts: { [key: string]: Chart } = {};

  constructor(private statisticsService: StatisticsService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngAfterViewInit(): void {
    // Ensure charts are rendered after the view is initialized
    if (Object.keys(this.requestStats).length) {
      this.renderCharts();
    }
  }

  loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe({
      next: (data) => {
        this.requestStats = data.request_stats || {};
        this.roleStats = data.role_stats || {};
        this.departmentStats = data.department_stats || {};
        this.trendStats = data.trend_stats || {};
        // Trigger chart rendering after data is loaded
        this.renderCharts();
      },
      error: (error) => {
        Swal.fire('Erreur', 'Échec du chargement des statistiques', 'error');
        console.error(error);
      },
    });
  }

  renderCharts(): void {
    // Destroy existing charts to prevent duplication
    ['requestChart', 'roleChart', 'departmentChart', 'trendChart'].forEach((chartId) => {
      if (this.charts[chartId]) {
        this.charts[chartId].destroy();
      }
    });

    // Request Status Pie Chart
    this.charts['requestChart'] = new Chart('requestChart', {
      type: 'pie',
      data: {
        labels: ['En attente', 'Approuvé', 'Rejeté'],
        datasets: [{
          data: [
            this.requestStats.pending || 0,
            this.requestStats.approved || 0,
            this.requestStats.rejected || 0,
          ],
          backgroundColor: ['#FFC107', '#4CAF50', '#F44336'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
      },
    });

    // Role Distribution Pie Chart
    this.charts['roleChart'] = new Chart('roleChart', {
      type: 'pie',
      data: {
        labels: ['Admin', 'Manager', 'Employé'],
        datasets: [{
          data: [
            this.roleStats.admin || 0,
            this.roleStats.manager || 0,
            this.roleStats.employee || 0,
          ],
          backgroundColor: ['#2196F3', '#9C27B0', '#FF9800'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
      },
    });

    // Department Bar Chart
    this.charts['departmentChart'] = new Chart('departmentChart', {
      type: 'bar',
      data: {
        labels: Object.keys(this.departmentStats),
        datasets: [{
          label: 'Demandes par département',
          data: Object.values(this.departmentStats),
          backgroundColor: '#3F51B5',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
        scales: { y: { beginAtZero: true } },
      },
    });

    // Trend Line Chart
    this.charts['trendChart'] = new Chart('trendChart', {
      type: 'line',
      data: {
        labels: Object.keys(this.trendStats),
        datasets: [{
          label: 'Demandes par mois',
          data: Object.values(this.trendStats),
          borderColor: '#009688',
          fill: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  async exportToPDF(): Promise<void> {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yOffset = 30;

      // Header
      const addHeader = () => {
        doc.setFillColor(63, 81, 181);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text('Rapport des Statistiques - Télétravail', margin, 12);
        doc.setTextColor(0, 0, 0);
      };

      // Footer
      const addFooter = (pageNum: number, totalPages: number) => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${pageNum} / ${totalPages} | Généré le ${new Date().toLocaleDateString('fr-FR')}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      };

      // Title
      addHeader();
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Rapport des Statistiques', pageWidth / 2, yOffset, { align: 'center' });
      yOffset += 10;
      doc.setFontSize(12);
      doc.text(
        `Période : Jusqu'au ${new Date().toLocaleDateString('fr-FR')}`,
        pageWidth / 2,
        yOffset,
        { align: 'center' }
      );
      yOffset += 15;

      // Summary Statistics
      doc.setFontSize(14);
      doc.text('Résumé des Statistiques', margin, yOffset);
      yOffset += 8;
      doc.setFontSize(11);
      // Calculate total requests
      const totalRequests = Object.values(this.requestStats).reduce((a, b) => a + (b || 0), 0);
      doc.text(`Total demandes : ${totalRequests}`, margin, yOffset);
      yOffset += 6;
      doc.text(`En attente : ${this.requestStats.pending || 0}`, margin, yOffset);
      yOffset += 6;
      doc.text(`Approuvées : ${this.requestStats.approved || 0}`, margin, yOffset);
      yOffset += 6;
      doc.text(`Rejetées : ${this.requestStats.rejected || 0}`, margin, yOffset);
      yOffset += 10;
      // Calculate total users
      const totalUsers = Object.values(this.roleStats).reduce((a, b) => a + (b || 0), 0);
      doc.text(`Total utilisateurs : ${totalUsers}`, margin, yOffset);
      yOffset += 6;
      doc.text(`Admins : ${this.roleStats.admin || 0}`, margin, yOffset);
      yOffset += 6;
      doc.text(`Managers : ${this.roleStats.manager || 0}`, margin, yOffset);
      yOffset += 6;
      doc.text(`Employés : ${this.roleStats.employee || 0}`, margin, yOffset);
      yOffset += 15;

      // Charts
      const chartIds = ['requestChart', 'roleChart', 'departmentChart', 'trendChart'];
      const chartTitles = [
        'Statut des demandes',
        'Répartition des rôles',
        'Demandes par département',
        'Tendances des demandes',
      ];

      for (let index = 0; index < chartIds.length; index++) {
        const chartId = chartIds[index];
        const canvas = document.getElementById(chartId) as HTMLCanvasElement;

        if (!canvas) {
          console.warn(`Canvas ${chartId} not found`);
          continue;
        }

        // Capture chart with higher quality
        const canvasImg = await html2canvas(canvas, { scale: 2 });
        const imgData = canvasImg.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        // Check for page break
        if (yOffset + imgHeight + 30 > pageHeight - 20) {
          doc.addPage();
          addHeader();
          yOffset = 30;
        }

        // Add chart title
        doc.setFontSize(14);
        doc.text(chartTitles[index], margin, yOffset);
        yOffset += 10;

        // Add chart image
        doc.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 15;
      }

      // Add footer to all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(i, totalPages);
      }

      // Save PDF
      doc.save(`statistics-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire('Erreur', 'Échec de la génération du PDF', 'error');
    }
  }
}