import { Typography, Descriptions, Avatar, Tag } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import StarIcon from "../components/Icons/StarIcon";
import MoonIcon from "../components/Icons/MoonIcon";
import RocketIcon from "../components/Icons/RocketIcon";
import "./About.css";

const { Title, Paragraph } = Typography;

const skillGroups = [
  {
    title: "⚛️ 前端",
    color: "blue",
    skills: ["🌐 HTML/CSS", "📜 JavaScript", "⚛️ React", "🔷 TypeScript", "💚 Vue"],
  },
  {
    title: "☕ 后端",
    color: "green",
    skills: ["☕ Java", "🍃 Spring Boot", "🗃️ MyBatis", "🐬 MySQL", "🟢 Node.js"],
  },
  {
    title: "🛠️ 工具",
    color: "purple",
    skills: ["📦 Git", "📦 Webpack", "⚡ Vite", "🐳 Docker", "🐧 Linux"],
  },
]

function About() {
  useDocumentTitle("关于 - Liubai's Blog")

  return (
    <div className="about-page">
      <div className="about-hero">
        <StarIcon size={18} className="about-hero-star about-hero-star-1" />
        <StarIcon size={12} className="about-hero-star about-hero-star-2" />
        <MoonIcon size={24} className="about-hero-moon" />
        <RocketIcon size={20} className="about-hero-rocket" />
        <Avatar
          size={96}
          className="about-avatar"
          style={{ backgroundColor: "#1677ff", fontSize: 40 }}
          alt="Liubai"
        >
          L
        </Avatar>
        <Title level={2} className="about-name">
          Liubai
        </Title>
        <Paragraph className="about-tagline" type="secondary">
          前端开发者 / 技术爱好者
        </Paragraph>
      </div>

      <div className="about-section">
        <Title level={3} className="about-section-title">
          关于本站
        </Title>
        <Paragraph className="about-description">
          这是一个自己搭建的个人博客。
          主要用于记录技术学习笔记、项目经验和生活感悟。
        </Paragraph>
      </div>

      <div className="about-section">
        <Title level={3} className="about-section-title">
          技术栈
        </Title>
        <div className="about-skills">
          {skillGroups.map(group => (
            <div key={group.title} className="about-skill-group">
              <div className="about-skill-group-title">
                {group.title}
              </div>
              <div className="about-skill-tags">
                {group.skills.map(skill => (
                  <Tag key={skill} color={group.color}>{skill}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <Title level={3} className="about-section-title">
          联系方式
        </Title>
        <div className="about-contact-card">
          <Descriptions column={1} style={{ marginBottom: 0 }}>
            <Descriptions.Item
              label={<><GithubOutlined /> GitHub</>}
            >
              <a
                href="https://github.com/liubaicat"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/liubaicat
              </a>
            </Descriptions.Item>
            <Descriptions.Item
              label={<><GithubOutlined style={{ color: 'var(--color-red)' }} /> Gitee</>}
            >
              <a
                href="https://gitee.com/liubai-cat"
                target="_blank"
                rel="noopener noreferrer"
              >
                gitee.com/liubai-cat
              </a>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </div>
  );
}

export default About;
