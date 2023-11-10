import { Client } from '../client';
import { Job } from '.';
import { Collection } from 'discord.js';
import { ClusterUtils } from '../utils';

export class ClientJobManager {
  client: Client;
  jobs: Collection<string, Job>;
  tag: string;
  constructor(client: Client, jobs?: Job[]) {
    this.client = client;
    this.jobs = new Collection();
    if (jobs) jobs.forEach((job) => this.addJob(job));
    this.tag = ClusterUtils.hasCluster(client)
      ? `[ClientJobManager Cluster-${client.cluster.id}]`
      : '[ClientJobManager]';
    client.once('ready', () => {
      client.logger.info(this.tag, `Client is ready, initializing (${this.jobs.size}) jobs...`);
      this.startAll();
    });
  }

  startAll() {
    this.jobs.forEach((job) => {
      job.start(this.client);
    });
  }

  stopAll() {
    this.jobs.forEach((job) => {
      job.stop();
    });
  }

  addJob(job: Job) {
    this.jobs.set(job.id, job);
    return this.jobs;
  }

  startJob(id: string) {
    const job = this.getJob(id);
    if (!job) return false;
    job.start(this.client);
    return this.jobs;
  }

  stopJob(id: string) {
    const job = this.getJob(id);
    if (!job) return false;
    job.stop();
    return this.jobs;
  }

  pauseJob(id: string) {
    const job = this.getJob(id);
    if (!job) return false;
    job.pause();
    return this.jobs;
  }

  resumeJob(id: string) {
    const job = this.getJob(id);
    if (!job) return false;
    job.resume();
    return this.jobs;
  }

  removeJob(id: string) {
    const job = this.getJob(id);
    if (!job) return false;
    this.stopJob(id);
    return this.jobs.delete(id);
  }

  getJob(id: string) {
    return this.jobs.get(id);
  }
}
