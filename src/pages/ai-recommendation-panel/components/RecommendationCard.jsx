import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationCard = ({ recommendation, onAccept, onOverride, onFeedback }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-error/10 border-error/20';
      case 'high': return 'bg-warning/10 border-warning/20';
      case 'medium': return 'bg-accent/10 border-accent/20';
      case 'low': return 'bg-success/10 border-success/20';
      default: return 'bg-muted/10 border-muted/20';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-error';
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onAccept(recommendation?.id);
    setIsProcessing(false);
  };

  const handleOverride = () => {
    onOverride(recommendation?.id);
  };

  return (
    <div className={`bg-card border rounded-lg p-6 transition-control hover:border-accent/30 ${getPriorityBg(recommendation?.priority)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPriorityBg(recommendation?.priority)}`}>
            <Icon 
              name={recommendation?.type === 'routing' ? 'Route' : recommendation?.type === 'scheduling' ? 'Clock' : 'Zap'} 
              size={18} 
              className={getPriorityColor(recommendation?.priority)}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground">{recommendation?.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(recommendation?.priority)} bg-current/10`}>
                {recommendation?.priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {recommendation?.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Target" size={12} />
                <span>Confidence: </span>
                <span className={`font-medium ${getConfidenceColor(recommendation?.confidence)}`}>
                  {recommendation?.confidence}%
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{recommendation?.estimatedTime} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Train" size={12} />
                <span>{recommendation?.affectedTrains} trains</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-muted-foreground hover:text-foreground transition-control"
        >
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </button>
      </div>
      {/* Expected Impact */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-success">
            -{recommendation?.expectedImpact?.delayReduction}min
          </div>
          <div className="text-xs text-muted-foreground">Delay Reduction</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success">
            +{recommendation?.expectedImpact?.efficiencyGain}%
          </div>
          <div className="text-xs text-muted-foreground">Efficiency Gain</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">
            ${recommendation?.expectedImpact?.costSaving}k
          </div>
          <div className="text-xs text-muted-foreground">Cost Saving</div>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-4 mb-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Optimization Logic</h4>
            <p className="text-sm text-muted-foreground">
              {recommendation?.logic}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Implementation Steps</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              {recommendation?.steps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Risk Assessment</h4>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                recommendation?.riskLevel === 'low' ? 'bg-success' :
                recommendation?.riskLevel === 'medium' ? 'bg-warning' : 'bg-error'
              }`} />
              <span className="text-sm text-muted-foreground capitalize">
                {recommendation?.riskLevel} Risk
              </span>
              <span className="text-sm text-muted-foreground">
                • {recommendation?.riskDescription}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleAccept}
            loading={isProcessing}
            iconName="Check"
            iconPosition="left"
            disabled={recommendation?.status === 'accepted'}
          >
            {recommendation?.status === 'accepted' ? 'Accepted' : 'Accept'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleOverride}
            iconName="X"
            iconPosition="left"
            disabled={recommendation?.status === 'overridden'}
          >
            {recommendation?.status === 'overridden' ? 'Overridden' : 'Override'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFeedback(recommendation?.id)}
            iconName="MessageSquare"
            iconPosition="left"
          >
            Feedback
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Generated {new Date(recommendation.timestamp)?.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;